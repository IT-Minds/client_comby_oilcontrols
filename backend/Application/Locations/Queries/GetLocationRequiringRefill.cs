

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Refills;
using Domain.EntityExtensions;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.Queries
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_LOCATION)]
  public class GetLocationRequiringRefill : IRequest<List<LocationRefillDto>>
  {
    public int TruckId { get; set; }
    public class GetLocationRequiringRefillHandler : IRequestHandler<GetLocationRequiringRefill, List<LocationRefillDto>>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetLocationRequiringRefillHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      private async Task<List<AssignedRefill>> GetAutomaticRefills()
      {
        var nextWeek = DateTimeOffset.UtcNow.AddDays(14);

        var locations = await _context.Locations
          .Include(x => x.Refills)
          .Include(x => x.FuelTank) //required to calculate min fuel level
          .Include(x => x.Region) //required to calculate min fuel level
            .ThenInclude(r => r.DailyTemperatures) //required to calculate min fuel level
          .Where(x =>
            x.Schedule == RefillSchedule.AUTOMATIC &&
            !x.Refills.Any(r => r.RefillState == RefillState.ASSIGNED) // Can't have an upcoming Refill.

          )
          .ToListAsync();

        var refills = locations
          .Where(x => DateTimeOffset.Compare(x.PredictDayReachingMinimumFuelLevel(7), nextWeek) <= 0)
          .Select(location => new AssignedRefill
          {
            Location = location,
            ExpectedDeliveryDate = location.PredictDayReachingMinimumFuelLevel(7),
            RefillState = RefillState.ASSIGNED
          }).ToList();

        return refills;
      }

      private async Task<List<AssignedRefill>> GetIntervalRefills()
      {
        var now = DateTimeOffset.UtcNow;

        var locations = await _context.Locations
          .Include(x => x.Refills)
          .Where(x =>
            x.Schedule == RefillSchedule.INTERVAL &&
            !x.Refills.Any(x => x.RefillState == RefillState.ASSIGNED) // Can't have an upcoming Refill.
          )
          .ToListAsync();

        var locationToRefill = locations
          .Where(l =>
            !l.CompletedRefills.Any() ||
            l.DaysBetweenRefills >= (
              now - l.CompletedRefills.Max(x => x.ActualDeliveryDate)
            ).Days // The days between now and last refill must be greater than the
          );

        var refills = locationToRefill.Select(location => new AssignedRefill
        {
          Location = location,
          ExpectedDeliveryDate = now.AddDays(location.DaysBetweenRefills).DateTime,
          RefillState = RefillState.ASSIGNED
        }).ToList();

        return refills;
      }

      private async Task<List<AssignedRefill>> GetManualRefills()
      {
        var now = DateTimeOffset.UtcNow;

        var locationToRefill = await _context.Locations
          .Include(x => x.Refills)
          .Where(x =>
            x.Schedule == RefillSchedule.MANUAL &&
            !x.Refills.Where(x => x.RefillState == RefillState.ASSIGNED).Any()
          )
          .ToListAsync();

        var refills = locationToRefill.Select(location => new AssignedRefill
        {
          Location = location,
          ExpectedDeliveryDate = now.AddDays(location.DaysBetweenRefills).DateTime,
          RefillState = RefillState.ASSIGNED
        }).ToList();

        return refills;
      }

      private async Task SyncLocationsToRefills(CancellationToken cancellationToken)
      {
        List<AssignedRefill> refills = new List<AssignedRefill>();
        refills.AddRange(await GetAutomaticRefills());
        refills.AddRange(await GetIntervalRefills());
        // refills.AddRange(await GetManualRefills());

        var trucks = await _context.Trucks
          .Include(r => r.Refills)
        .ToListAsync();

        var rand = new Random();
        trucks.OrderBy(x => rand.Next());

        var truckCount = 0;
        foreach (var refill in refills)
        {
          if (truckCount >= trucks.Count())
          {
            truckCount = 0;
          }
          var truck = trucks[truckCount++];
          refill.Truck = truck;
          _context.AssignedRefills.Add(refill);
        }

        await _context.SaveChangesAsync(cancellationToken);
      }

      public async Task<List<LocationRefillDto>> Handle(GetLocationRequiringRefill request, CancellationToken cancellationToken)
      {
        await SyncLocationsToRefills(cancellationToken);

        var refillDtos = await _context.Trucks
          .Include(r => r.Refills)
            .ThenInclude(r => r.Location)
              .ThenInclude(l => l.FuelTank)
          .Where(x => x.Id == request.TruckId)
          .SelectMany(x => x.Refills)
          .ProjectTo<LocationRefillDto>(_mapper.ConfigurationProvider)
          .ToListAsync();

        return refillDtos;

      }
    }
  }
}

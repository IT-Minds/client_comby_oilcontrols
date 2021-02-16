

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities.Refills;
using Domain.EntityExtensions;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.Queries
{
  //[AuthorizeAttribute(Domain.Enums.Action.GET_LOCATION)]
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
          .Where(x => x.Schedule == RefillSchedule.AUTOMATIC)
          .ToListAsync();

        var locationToRefill = locations
          .Where(x => DateTimeOffset.Compare(x.PredictDayReachingMinimumFuelLevel(7), nextWeek) <= 0)
          .Where(l => l.AssignedRefills.Count() <= 0); // Can't have an upcoming Refill.

        var refills = locationToRefill.Select(x => new AssignedRefill
        {
          LocationId = x.Id,
          ExpectedDeliveryDate = x.PredictDayReachingMinimumFuelLevel(7)
        }).ToList();

        return refills;
      }

      private async Task<List<AssignedRefill>> GetIntervalRefills()
      {
        var now = DateTimeOffset.UtcNow;

        var locations = await _context.Locations
          .Include(x => x.Refills)
          .Where(x => x.Schedule == RefillSchedule.INTERVAL)
          .ToListAsync();

        var locationToRefill = locations
          .Where(l =>
            l.AssignedRefills.Count() <= 0 && // Can't have an upcoming Refill.
            l.CompletedRefills.Count() > 0 && // Must have had at least one refill.
            l.DaysBetweenRefills >= (
              now - l.CompletedRefills.OrderByDescending(x => x.ActualDeliveryDate).First().ActualDeliveryDate
            ).Days // The days between now and last refill must be greater than the
          );

        var refills = locationToRefill.Select(x => new AssignedRefill
        {
          LocationId = x.Id,
          ExpectedDeliveryDate = now.AddDays(x.DaysBetweenRefills).DateTime
        }).ToList();

        return refills;
      }

      private async Task<List<AssignedRefill>> GetManualRefills()
      {
        var now = DateTimeOffset.UtcNow;

        var locations = await _context.Locations
          .Include(x => x.Refills)
          .Where(x => x.Schedule == RefillSchedule.MANUAL)
          .ToListAsync();

        var locationToRefill = locations
          .Where(l =>
            l.AssignedRefills.Count() <= 0 // Can't have an upcoming Refill.
          );

        var refills = locationToRefill.Select(x => new AssignedRefill
        {
          LocationId = x.Id,
          ExpectedDeliveryDate = now.AddDays(x.DaysBetweenRefills).DateTime
        }).ToList();

        return refills;
      }


      public async Task<List<LocationRefillDto>> Handle(GetLocationRequiringRefill request, CancellationToken cancellationToken)
      {

        var trucks = await _context.Trucks
          .Include(r => r.Refills)
        .ToListAsync();

        List<AssignedRefill> refills = new List<AssignedRefill>();
        refills.AddRange(await GetAutomaticRefills());
        refills.AddRange(await GetIntervalRefills());
        refills.AddRange(await GetManualRefills());


        var truckCount = 0;
        foreach (var refill in refills)
        {
          if (truckCount >= trucks.Count())
          {
            truckCount = 0;
          }
          var truck = trucks[truckCount++];
          if (truck.Refills == null)
          {
            truck.Refills = new List<AssignedRefill>();
          }
          truck.Refills.Add(refill);
        }

        await _context.SaveChangesAsync(cancellationToken);

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

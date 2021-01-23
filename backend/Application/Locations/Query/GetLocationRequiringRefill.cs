

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Domain.EntityExtensions;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.Queries
{
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

      private async Task<List<Refill>> GetAutomaticRefills()
      {
        var nextWeek = DateTimeOffset.UtcNow.AddDays(14);

        var locations = await _context.Locations
          .Include(x => x.Refills)
          .Include(x => x.FuelTank) //required to calculate min fuel level
          .Include(x => x.Region) //required to calculate min fuel level
            .ThenInclude(r => r.DailyTemperatures) //required to calculate min fuel level
          .ToListAsync();

        var locationToRefill = locations
          .Where(x => x.Schedule == RefillSchedule.AUTOMATIC && DateTimeOffset.Compare(x.PredictDayReachingMinimumFuelLevel(7), nextWeek) <= 0)
          .Where(l => l.Refills.Count(x => x.ActualDeliveryDate == null) <= 0 ); // Can't have an upcoming Refill.

        var refills = locationToRefill.Select(x => new Refill
        {
            LocationId = x.Id,
            ExpectedDeliveryDate = x.PredictDayReachingMinimumFuelLevel(7)
        }).ToList();

        return refills;
      }

      private async Task<List<Refill>> GetIntervalRefills()
      {
        var now = DateTimeOffset.UtcNow;

        var locations = await _context.Locations
          .Include(x => x.Refills)
          .Where(x => x.Schedule == RefillSchedule.INTERVAL)
          .ToListAsync();

        var locationToRefill = locations
          .Where(l =>
            l.Refills.Count(x => x.ActualDeliveryDate == null) <= 0 && // Can't have an upcoming Refill.
            l.Refills.Count(x => x.ActualDeliveryDate != null) > 0  && // Must have had at least one refill.
            l.DaysBetweenRefills >= (
              now - l.Refills.OrderByDescending(x => x.ActualDeliveryDate).First().ActualDeliveryDate
            ).Value.Days // The days between now and last refill must be greater than the
          );

        var refills = locationToRefill.Select(x => new Refill
        {
            LocationId = x.Id,
            ExpectedDeliveryDate = now.AddDays(x.DaysBetweenRefills).DateTime
        }).ToList();

        return refills;
      }

      private async Task<List<Refill>> GetManualRefills()
      {
        var now = DateTimeOffset.UtcNow;

        var locations = await _context.Locations
          .Include(x => x.Refills)
          .Where(x => x.Schedule == RefillSchedule.MANUAL)
          .ToListAsync();

        var locationToRefill = locations
          .Where(l =>
            l.Refills.Count(x => x.ActualDeliveryDate == null) <= 0 // Can't have an upcoming Refill.
          );

        var refills = locationToRefill.Select(x => new Refill
        {
            LocationId = x.Id,
            ExpectedDeliveryDate = now.AddDays(x.DaysBetweenRefills).DateTime
        }).ToList();

        return refills;
      }


      public async Task<List<LocationRefillDto>> Handle(GetLocationRequiringRefill request, CancellationToken cancellationToken)
      {

          var trucks = await _context.Trucks
          .Include(t => t.Route)
            .ThenInclude(r => r.Refills)
          .ToListAsync();

          List<Refill> refills = new List<Refill>();
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
            if (truck.Route == null)
            {
              truck.Route = new Route { Refills = new List<Refill>() };
            }
            truck.Route.Refills.Add(refill);
          }

          await _context.SaveChangesAsync(cancellationToken);

          var refillDtos = await _context.Trucks
            .Include(r => r.Route)
              .ThenInclude(r => r.Refills)
                .ThenInclude(r => r.Location)
                  .ThenInclude(l => l.FuelTank)
            .Where(x => x.Id == request.TruckId)
            .SelectMany(x => x.Route.Refills)
            .ProjectTo<LocationRefillDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

          return refillDtos;

      }
    }
  }
}

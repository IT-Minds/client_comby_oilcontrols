using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Domain.Entities.Refills;
using Domain.EntityExtensions;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Services
{
  public class RunListService
  {

    private readonly IApplicationDbContext _context;

    public RunListService(IApplicationDbContext context)
    {
      _context = context;
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

      public async Task SyncLocationsToRefills(CancellationToken cancellationToken)
      {
        var existingRefills = await _context.AssignedRefills.Select(r => r.LocationId).ToListAsync();

        List<AssignedRefill> refills = new List<AssignedRefill>();
        refills.AddRange(await GetAutomaticRefills());
        refills.AddRange(await GetIntervalRefills());
        // refills.AddRange(await GetManualRefills());

        refills = refills.Where(r => !existingRefills.Contains(r.Location.Id)).ToList();

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
  }

}

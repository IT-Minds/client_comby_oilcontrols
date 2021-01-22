

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
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.Queries.GetTruckInfo
{
  public class GetLocationRequiringRefill : IRequest<List<int>>
  {
    public int TruckId { get; set; }
    public class GetLocationRequiringRefillHandler : IRequestHandler<GetLocationRequiringRefill, List<int>>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetLocationRequiringRefillHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }
      public async Task<List<int>> Handle(GetLocationRequiringRefill request, CancellationToken cancellationToken)
      {
        var nextWeek = DateTimeOffset.UtcNow.AddDays(7);

        var locations = await _context.Locations
          .Include(x => x.Refills)
          .Include(x => x.FuelTank) //required to calculate mini fuel level
          .Include(x => x.Region) //required to calculate mini fuel level
            .ThenInclude(r => r.DailyTemperatures) //required to calculate mini fuel level
          .Where(x => DateTimeOffset.Compare(x.PredictDayReachingMinimumFuelLevel(7), nextWeek) <= 0)
          .OrderBy(x => x.Address)
          .ToListAsync();

        var trucks = await _context.Trucks
        .Include(t => t.Route)
          .ThenInclude(r => r.Refills)
        .ToListAsync();

        var locationToRefill = locations
          .Where(l => l.Refills.Count(x => x.ActualDeliveryDate == null) <= 0 );

        var refills = locationToRefill.Select(x => new Refill
        {
            LocationId = x.Id,
            ExpectedDeliveryDate = x.PredictDayReachingMinimumFuelLevel(7)
        }).ToArray();

        var truckCount = 0;
        foreach (var refill in refills)
        {
          if (truckCount >= trucks.Count())
          {
            truckCount = 0;
          }

          trucks[truckCount++].Route.Refills.Add(refill);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return locationToRefill.Select(x => x.Id).ToList();
      }
    }
  }
}

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Refills.Commands.OrderRefill
{
  [AuthorizeAttribute(Domain.Enums.Action.ORDER_REFILL)]
  public class OrderRefillCommand : IRequest<int>
  {
    public DateTime ExpectedDeliveryDate { get; set; }
    public int LocationId { get; set; }
    public int TruckId { get; set; }


    public class OrderRefillCommandHandler : IRequestHandler<OrderRefillCommand, int>
    {
      public readonly IApplicationDbContext _context;

      public OrderRefillCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(OrderRefillCommand request, CancellationToken cancellationToken)
      {

        var truck = await _context.Trucks
          .Include(t => t.Route)
            .ThenInclude(r => r.Refills)
          .Where(t => t.Id == request.TruckId)
          .FirstOrDefaultAsync();

        if (truck == null)
        {
          throw new NotFoundException(nameof(Truck), request.TruckId);
        }
        var location = await _context.Locations
          .FirstOrDefaultAsync(location => location.Id == request.LocationId);

        if (location == null)
        {
          throw new NotFoundException(nameof(Location), request.LocationId);
        }

        if (truck.Route == null)
        {
          truck.Route = new Route { Refills = new List<Refill>() };
        }

        var refill = truck.Route.Refills
          .FirstOrDefault(refill => refill.ActualDeliveryDate == null && refill.LocationId == request.LocationId);
        if (refill != null)
        {
          truck.Route.Refills.Remove(refill);
        }

        var newRefill = new Refill
        {

          ExpectedDeliveryDate = request.ExpectedDeliveryDate,
          LocationId = request.LocationId
        };

        truck.Route.Refills.Add(newRefill);

        // _context.Routes.Update(route);
        _context.Trucks.Update(truck);

        await _context.SaveChangesAsync(cancellationToken);

        return newRefill.Id;
      }
    }
  }
}

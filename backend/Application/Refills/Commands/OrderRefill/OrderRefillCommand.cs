using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Security;
using Domain.Entities;
using Domain.Entities.Refills;
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
          .Include(r => r.Refills)
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

        if (truck.Refills == null)
        {
          truck.Refills = new List<AssignedRefill>();
        }

        var refill = truck.Refills
          .FirstOrDefault(refill =>  refill.LocationId == request.LocationId);
        if (refill != null)
        {
          truck.Refills.Remove(refill);
          _context.AssignedRefills.Remove(refill);
        }

        var newRefill = new AssignedRefill
        {
          ExpectedDeliveryDate = request.ExpectedDeliveryDate,
          LocationId = request.LocationId
        };

        truck.Refills.Add(newRefill);

        // _context.Routes.Update(route);
        _context.Trucks.Update(truck);

        await _context.SaveChangesAsync(cancellationToken);

        return newRefill.Id;
      }
    }
  }
}

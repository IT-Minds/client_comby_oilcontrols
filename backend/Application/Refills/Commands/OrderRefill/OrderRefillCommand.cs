using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Refills.Commands.OrderRefill
{
  public class OrderRefillCommand : IRequest<int>
  {
    public DateTime ExpectedDeliveryDate { get; set; }
    public int LocationId { get; set; }
    public int RouteId { get; set; }


    public class OrderRefillCommandHandler : IRequestHandler<OrderRefillCommand, int>
    {
      public readonly IApplicationDbContext _context;

      public OrderRefillCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(OrderRefillCommand request, CancellationToken cancellationToken)
      {
        var route = _context.Routes
          .Include("Refills")
          .FirstOrDefault(route => route.Id == request.RouteId);
        if(route == null)
        {
          throw new ArgumentException("Nonexistent route: "+request.RouteId);
        }

        var location = _context.Locations.FirstOrDefault(location => location.Id == request.LocationId);
        if(location == null)
        {
          throw new ArgumentException("Nonexistent location: "+request.LocationId);
        }

        var refill = route.Refills.FirstOrDefault(refill => refill.LocationId == request.LocationId);
        if(refill != null)
        {
          route.Refills.Remove(refill);
        }

        var newRefill = new Refill{
          ExpectedDeliveryDate = request.ExpectedDeliveryDate,
          LocationId = request.LocationId
        };
        route.Refills.Add(newRefill);

        await _context.SaveChangesAsync(cancellationToken);

        return newRefill.Id;
      }
    }
  }
}
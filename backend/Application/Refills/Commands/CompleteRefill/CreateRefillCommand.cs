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
using Newtonsoft.Json;
using Application.Common.Security;

namespace Application.Refills.Commands.CompleteRefill
{
  [AuthorizeAttribute(Domain.Enums.Action.CREATE_REFILL)]
  public class CompleteRefillCommand : IRequest<int>
  {
    [JsonIgnore]
    public int Id { get; set; }
    public double StartAmount { get; set; }
    public double EndAmount { get; set; }
    public int CouponNumber { get; set; }
    public DateTime ActualDeliveryDate { get; set; }
    public TankState TankState { get; set; }

    public class CompleteRefillCommandHandler : IRequestHandler<CompleteRefillCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CompleteRefillCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(CompleteRefillCommand request, CancellationToken cancellationToken)
      {

        var refill = await _context.Refills.FindAsync(request.Id);

        if (refill == null)
        {
          throw new NotFoundException(nameof(Refill), request.Id);
        }

        var truck = await _context.Trucks
          .Include(t => t.Route)
            .ThenInclude(r => r.Refills)
          .Include(x => x.DailyStates.Where(x => x.Date.DayOfYear == request.ActualDeliveryDate.DayOfYear && x.Date.Year == request.ActualDeliveryDate.Year))
          .Where(t => t.Route.Refills.Any(r => r.Id == refill.Id))
          .FirstOrDefaultAsync();

        if (truck == null)
        {
          throw new NotFoundException(nameof(Truck), request.Id);
        }

        var coupon = await _context.Coupons
            .Where(x => x.Status == CouponStatus.AVAILABLE && x.TruckId == truck.Id)
            .OrderBy(x => x.CouponNumber)
            .FirstOrDefaultAsync();

        if (coupon == null)
        {
          throw new NotFoundException(nameof(coupon), request.CouponNumber);
        }

        if (request.CouponNumber != coupon.CouponNumber)
        {
          throw new ArgumentException("Invalid Coupon Number: " + request.CouponNumber + ". Should have been: " + coupon.CouponNumber);
        }

        refill.StartAmount = request.StartAmount;
        refill.EndAmount = request.EndAmount;
        refill.ActualDeliveryDate = request.ActualDeliveryDate;
        refill.TankState = request.TankState;

        refill.CouponId = coupon.Id;

        refill.RefillNumber = truck.RefillNumber++;
        // refill.RouteId = null; //TODO should properly detach the entity from the route

        coupon.Status = CouponStatus.USED;


        _context.Trucks.Update(truck);
        _context.Coupons.Update(coupon);
        _context.Refills.Update(refill);

        await _context.SaveChangesAsync(cancellationToken);

        return refill.Id;
      }
    }
  }
}

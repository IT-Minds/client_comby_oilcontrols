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
using Domain.Entities.Refills;

namespace Application.Refills.Commands.CompleteRefill
{
  //[AuthorizeAttribute(Domain.Enums.Action.CREATE_REFILL)]
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

        var refill = await _context.AssignedRefills.FirstOrDefaultAsync(x => x.Id == request.Id);

        if (refill == null)
        {
          throw new NotFoundException(nameof(AssignedRefill), request.Id);
        }

        var truck = await _context.Trucks
            .Include(r => r.Refills)
          .Include(x => x.DailyStates.Where(x => x.Date.DayOfYear == request.ActualDeliveryDate.DayOfYear && x.Date.Year == request.ActualDeliveryDate.Year))
          .Where(t => t.Refills.Any(r => r.Id == refill.Id))
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

        var completingrefill = new CompletedRefill(refill);

        completingrefill.StartAmount = request.StartAmount;
        completingrefill.EndAmount = request.EndAmount;
        completingrefill.ActualDeliveryDate = request.ActualDeliveryDate;
        completingrefill.TankState = request.TankState;
        completingrefill.CouponId = coupon.Id;
        completingrefill.RefillNumber = truck.RefillNumber++;
        // completingrefill.RefillState = RefillState.COMPLETED;

        coupon.Status = CouponStatus.USED;

        _context.Trucks.Update(truck);
        _context.Coupons.Update(coupon);

        _context.AssignedRefills.Remove(refill);
        _context.CompletedRefills.Add(completingrefill);

        await _context.SaveChangesAsync(cancellationToken);

        return refill.Id;
      }
    }
  }
}

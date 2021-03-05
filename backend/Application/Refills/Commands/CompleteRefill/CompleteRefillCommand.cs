using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.EntityExtensions;
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
using UniContaDomain.Entities;

namespace Application.Refills.Commands.CompleteRefill
{
  [AuthorizeAttribute(Domain.Enums.Action.COMPLETE_REFILL)]
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
      private readonly IUniContaService _uniContaService;

      public CompleteRefillCommandHandler(IApplicationDbContext context, IUniContaService uniContaService)
      {
        _context = context;
        _uniContaService = uniContaService;
      }

      private async Task PostUniContaOrder(int refillId)
      {
        if (!await _uniContaService.Login())
        {
          // TODO throw exception???
        }

        var refill = await _context.CompletedRefills
          .Include(r => r.Location)
            .ThenInclude(r => r.Debtors)
              .ThenInclude(d => d.Debtor)
          .Include(r => r.Coupon)
          .FirstOrDefaultAsync(x => x.Id == refillId);

        (int OrderId, int OrderLineId) = await _uniContaService.CreateOrder(new UniContaOrder
        {
          AmountFilled = refill.AmountDelivered(),
          BuildingId = refill.LocationId.ToString(),
          CouponId = refill.CouponId,
          CouponNumber = refill.Coupon.CouponNumber.ToString(),
          Date = refill.ActualDeliveryDate,
          DebtorId = refill.Location.ActiveDebtor().UnicontaId,
          ProductId = "1111"
        });

        System.Console.WriteLine("CREATED ORDER " + OrderId + " WITH OL " + OrderLineId);
      }


      public async Task<int> Handle(CompleteRefillCommand request, CancellationToken cancellationToken)
      {

        var refill = await _context.AssignedRefills.FirstOrDefaultAsync(x => x.Id == request.Id);

        if (refill == null)
        {
          throw new NotFoundException(nameof(AssignedRefill), request.Id);
        }

        var truck = await _context.Trucks
          .Include(t => t.Refills)
          .Include(t => t.DailyStates
            .Where(ds => ds.Date.DayOfYear == request.ActualDeliveryDate.DayOfYear && ds.Date.Year == request.ActualDeliveryDate.Year)
          )
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
        completingrefill.Coupon = coupon;
        completingrefill.RefillNumber = truck.RefillNumber++;

        coupon.Status = CouponStatus.USED;

        _context.Trucks.Update(truck);
        _context.Coupons.Update(coupon);
        _context.AssignedRefills.Remove(refill);
        _context.CompletedRefills.Add(completingrefill);

        await _context.SaveChangesAsync(cancellationToken);

        try
        {
          await PostUniContaOrder(completingrefill.Id);
        }
        catch (System.FormatException e)
        {
          throw new ArgumentException("Couldn't access Uniconta.");
        }


        return refill.Id;
      }
    }
  }
}

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

namespace Application.Refills.Commands.CreateRefill
{
  public class CreateRefillCommand : IRequest<int>
  {
    public int TruckId { get; set; }
    public TankType TankType { get; set; }
    public int TankNumber { get; set; }
    public double StartAmount { get; set; }
    public double EndAmount { get; set; }
    public int CouponNumber { get; set; }
    public DateTime ExpectedDeliveryDate { get; set; }
    public FuelType FuelType { get; set; }
    public TankState TankState { get; set; }

    public class CreateRefillCommandHandler : IRequestHandler<CreateRefillCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateRefillCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(CreateRefillCommand request, CancellationToken cancellationToken)
      {

        var Location = await _context.Locations
          .Include("FuelTank")
          .FirstOrDefaultAsync(x => x.FuelTank.Type == request.TankType && x.FuelTank.TankNumber == request.TankNumber);
        if (Location == null)
        {
          throw new NotFoundException(nameof(Location), request.TankType + " " + request.TankNumber);
        }

        var Coupon = await _context.Coupons
            .Where(x => x.Status == CouponStatus.AVAILABLE && x.Truck.Id == request.TruckId)
            .OrderBy(x => x.CouponNumber)
            .FirstOrDefaultAsync();

        if (Coupon == null)
        {
          throw new NotFoundException(nameof(Coupon), request.CouponNumber);
        }

        if (request.CouponNumber != Coupon.CouponNumber)
        {
          throw new ArgumentException("Invalid Coupon Number: " + request.CouponNumber );
        }

        var refill = new Refill
        {
          StartAmount = request.StartAmount,
          EndAmount = request.EndAmount,
          Coupon = Coupon,
          ExpectedDeliveryDate = request.ExpectedDeliveryDate,
          Type = request.FuelType,
          TankState = request.TankState,
          Location = Location
        };

        Coupon.Status = CouponStatus.USED;

        _context.Coupons.Update(Coupon);
        _context.Refills.Add(refill);

        await _context.SaveChangesAsync(cancellationToken);

        return refill.Id;
      }
    }
  }
}

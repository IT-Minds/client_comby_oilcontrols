using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Refill.Commands.CreateRefill
{
  public class CreateRefillCommand : IRequest<int>
  {
    public int TruckId { get; set; }
    public TankType TankType { get; set; }
    public int TankNumber { get; set; }
    public int Amount { get; set; }
    public int CouponNumber { get; set; }
    public DateTime Date { get; set; }
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

        var Location = _context.Locations.First( x => x.Type == request.TankType && x.TankNumber == request.TankNumber);
        if (Location == null){
          throw new NotFoundException(nameof(Location), request.TankType+" "+request.TankNumber);
        }
        
        var Coupons = _context.Coupons.Where(x => x.Status == Domain.Enums.CouponStatus.AVAILABLE && x.Truck.Id == request.TruckId);
        Coupons = Coupons.OrderBy(x => x.Id);
        var Coupon = Coupons.First();
        if(Coupon == null) {
          throw new NotFoundException(nameof(Coupon), request.CouponNumber);
        }
        if(request.CouponNumber != Coupon.Id){
          throw new ValidationException();
        }

        var refill = new Domain.Entities.Refill
        {
          Amount = request.Amount,
          Coupon = Coupon,
          Date = request.Date,
          Type = request.FuelType,
          TankState = request.TankState,
          Location = Location
        };

        Coupon.Status = Domain.Enums.CouponStatus.USED;
        
        _context.Coupons.Update(Coupon);
        _context.Refills.Add(refill);
        
        await _context.SaveChangesAsync(cancellationToken);

        return refill.Id;
      }
    }
  }
}

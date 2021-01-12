using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Application.Common.Exceptions;
using System.Linq;

namespace Application.Coupons.Commands.UpdateCouponStatus
{
  public class UpdateCouponStatusCommand : IRequest<int>
  {
    public int TruckId { get; set; }
    public int CouponNumber { get; set; }

    public class UpdateCouponstatusCommandHandler : IRequestHandler<UpdateCouponStatusCommand, int>
    {
      private readonly IApplicationDbContext _context; 

      public UpdateCouponstatusCommandHandler(IApplicationDbContext context){
        _context = context;
      }

      public async Task<int> Handle(UpdateCouponStatusCommand request, CancellationToken cancellationToken)
      {
        var coupons = _context.Coupons.Where(x => x.TruckId == request.TruckId);
        var coupon = coupons.FirstOrDefault(x => x.CouponNumber == request.CouponNumber);
        if(coupon == null){
          throw new NotFoundException(nameof(coupon), request.CouponNumber);
        }

        coupon.Status = CouponStatus.DESTROYED;
        await _context.SaveChangesAsync(cancellationToken);

        return request.CouponNumber;
      }
    }
  }
}
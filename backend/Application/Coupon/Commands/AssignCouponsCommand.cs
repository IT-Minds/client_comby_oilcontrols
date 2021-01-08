using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Application.Common.Exceptions;

namespace Application.Coupons.Commands.AssignCoupons
{
  public class AssignCouponsCommand : IRequest<List<int>>
  {
    public int TruckId {get; set; }
    public List<int> CouponNumbers { get; set; }

    public class AssignCouponsCommandCommandHandler : IRequestHandler<AssignCouponsCommand, List<int>>
    {
      private readonly IApplicationDbContext _context;

      public AssignCouponsCommandCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<List<int>> Handle(AssignCouponsCommand request, CancellationToken cancellationToken)
      {
        var Truck = _context.Trucks.Find(request.TruckId);
        if(Truck == null){
          throw new NotFoundException(nameof(Truck), request.TruckId);
        }

        foreach( int numb in request.CouponNumbers){
          _context.Coupons.Add(new Coupon{
            CouponNumber = numb,
            Truck = Truck
            });
        }

        await _context.SaveChangesAsync(cancellationToken);

        return request.CouponNumbers;
      }
    }
  }
}

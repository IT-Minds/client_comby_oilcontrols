using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Application.Common.Exceptions;
using System.Linq;
using Application.Common.Security;
using AutoMapper;

namespace Application.Coupons.Commands.AssignCoupons
{
  // The command assumes that all coupon numbers are handed out sequentially.
  [AuthorizeAttribute(Action.ASSIGN_COUPON)]
  public class AssignCouponsCommand : IRequest<IEnumerable<CouponIdDto>>
  {
    public AssignCouponDto Dto { get; set; }

    public class AssignCouponsCommandCommandHandler : IRequestHandler<AssignCouponsCommand, IEnumerable<CouponIdDto>>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public AssignCouponsCommandCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<IEnumerable<CouponIdDto>> Handle(AssignCouponsCommand request, CancellationToken cancellationToken)
      {
        var Truck = await _context.Trucks.FindAsync(request.Dto.TruckId);

        if (Truck == null)
        {
          throw new NotFoundException(nameof(Truck), request.Dto.TruckId);
        }

        List<Coupon> coupons = new List<Coupon>();

        foreach (int numb in request.Dto.CouponNumbers)
        {
          coupons.Add(new Coupon
          {
            CouponNumber = numb,
            Truck = Truck
          });
        }
        await _context.Coupons.AddRangeAsync(coupons);
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<IEnumerable<Coupon>, IEnumerable<CouponIdDto>>(coupons);
      }
    }
  }
}

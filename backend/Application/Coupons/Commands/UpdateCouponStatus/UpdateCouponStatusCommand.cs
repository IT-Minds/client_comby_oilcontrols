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

namespace Application.Coupons.Commands.UpdateCouponStatus
{
  [AuthorizeAttribute(Domain.Enums.Action.UPDATE_COUPON_STATUS)]
  public class UpdateCouponStatusCommand : IRequest<CouponIdDto>
  {
    public CouponStatusDto Dto { get; set; }

    public class UpdateCouponstatusCommandHandler : IRequestHandler<UpdateCouponStatusCommand, CouponIdDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public UpdateCouponstatusCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<CouponIdDto> Handle(UpdateCouponStatusCommand request, CancellationToken cancellationToken)
      {
        var coupon = _context.Coupons.FirstOrDefault(x => x.CouponNumber == request.Dto.CouponNumber);
        if (coupon == null)
        {
          throw new NotFoundException(nameof(coupon), request.Dto.CouponNumber);
        }

        coupon.Status = request.Dto.Status;
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<Coupon, CouponIdDto>(coupon);
      }
    }
  }
}
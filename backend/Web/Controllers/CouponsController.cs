using Application.Coupons;
using Application.Coupons.Commands.AssignCoupons;
using Application.Coupons.Commands.UpdateCouponStatus;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers
{

  public class CouponsController : ApiControllerBase
  {
    [HttpPost]
    public async Task<IEnumerable<CouponIdDto>> Create(AssignCouponsCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpPut("{couponNumber}/invalidate")]
    public async Task<ActionResult<CouponIdDto>> InvalidateCoupon([FromRoute] int couponNumber)
    {
      return await Mediator.Send(new UpdateCouponStatusCommand
      {
        Dto = new CouponStatusDto
        {
          CouponNumber = couponNumber
        }
      });
    }
  }
}

using Application.Common.Interfaces.Pagination;
using Application.Coupons.Commands.AssignCoupons;
using Application.Coupons.Commands.UpdateCouponStatus;
using Application.Coupons.Queries.GetCoupons;
using Application.Coupons.Queries.GetCoupons.Truck;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Controllers
{

  public class CouponsController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<List<int>>> Create(AssignCouponsCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpPut("{couponNumber}/invalidate")]
    public async Task<ActionResult<int>> InvalidateCoupon([FromRoute] int couponNumber)
    {
      return await Mediator.Send(new UpdateCouponStatusCommand
      {
        CouponNumber = couponNumber
      });
    }
  }
}

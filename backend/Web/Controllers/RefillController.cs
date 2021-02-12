using Application.Common.Interfaces.Pagination;
using Application.Refills.Commands.CompleteRefill;
using Application.Refills.Queries.GetRefills;
using Application.Refills.Queries.GetRefills.Location;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Application.Coupons.Commands.SaveCouponImage;
using Microsoft.AspNetCore.Http;
using Application.Refills.Commands.OrderRefill;
using Application.Refills;

namespace Web.Controllers
{
  public class RefillController : ApiControllerBase
  {
    [HttpPost("{id}")]
    public async Task<ActionResult<int>> Complete([FromRoute] int id, CompleteRefillCommand command)
    {
      command.Id = id;
      return await Mediator.Send(command);
    }

    [HttpGet]
    public async Task<ActionResult<PageResult<RefillDto>>> Get(
      [FromQuery] string needle, [FromQuery] int size = 100, [FromQuery] int? skip = 0, [FromQuery] TankType? tankType = null
    )
    {
      return await Mediator.Send(new GetRefillsLocationQuery
      {
        Size = size,
        Needle = new System.DateTimeOffset(Int64.Parse(needle), new TimeSpan()),
        Skip = skip,
        TankType = tankType
      });
    }

    [HttpPost("{id}/image")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<CouponImageInfoDto>> SaveCouponImage([FromRoute] int id, IFormFile file)
    {
      return await Mediator.Send(new SaveCouponImageCommand
      {
        Dto = {
          File = file,
          RefillId = id
        }
      });
    }

    [HttpPost]
    public async Task<ActionResult<int>> OrderRefill(OrderRefillCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}

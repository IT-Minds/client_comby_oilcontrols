using Application.Common.Interfaces.Pagination;
using Application.Refills.Commands.CreateRefill;
using Application.Refills.Queries.GetRefills;
using Application.Refills.Queries.GetRefills.Location;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Web.Controllers
{
  public class RefillController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateRefillCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpGet]
    public async Task<ActionResult<PageResult<RefillDto>>> Get(
      [FromQuery] TankType tankType, [FromQuery] int tankNumber, [FromQuery] string needle, [FromQuery] int size, [FromQuery] int? skip = 0
    )
    {
      return await Mediator.Send(new GetRefillsLocationQuery
      {
        Size = size,
        Needle = new System.DateTimeOffset(Int64.Parse(needle), new TimeSpan()),
        Skip = skip,
        TankType = tankType,
        TankNumber = tankNumber
      });
    }
  }
}
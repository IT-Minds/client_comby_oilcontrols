using System;
using System.Threading.Tasks;
using Application.Common.Interfaces.Pagination;
using Application.LocationHistories.Queries;
using Application.LocationHistories.Queries.GetAllLocationHistories;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class LocationHistoryController : ApiControllerBase
  {
    [HttpGet]
    public async Task<ActionResult<PageResult<LocationHistoryDto>>> GetAllLocationHistories(
     [FromQuery] int needle, [FromQuery] int size = 1000, [FromQuery] int? skip = 0
    )
    {
      return await Mediator.Send(new GetAllLocationHistoriesQuery
      {
        Needle = needle,
        Size = size,
        Skip = skip
      });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PageResult<LocationHistoryDto>>> GetLocationHistory(
    [FromRoute] int id, [FromQuery] DateTime? needle = null, [FromQuery] int size = 1000, [FromQuery] int? skip = 0)
    {
      if (!needle.HasValue)
      {
        needle = DateTime.MaxValue;
      }

      return await Mediator.Send(new GetLocationHistoryQuery
      {
        LocationId = id,
        Needle = (DateTime)needle,
        Size = size,
        Skip = skip
      });
    }
  }
}

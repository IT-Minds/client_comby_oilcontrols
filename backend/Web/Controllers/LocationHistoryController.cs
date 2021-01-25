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
    [ResponseCache(Duration = 604800)] // 7 week cache
    public async Task<ActionResult<PageResult<LocationHistoryDto>>> Get(
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
    [ResponseCache(Duration = 604800)] // 7 week cache
    public async Task<ActionResult<PageResult<LocationHistoryDto>>> Get(
    [FromRoute] int id, [FromQuery] DateTime needle, [FromQuery] int size = 1000, [FromQuery] int? skip = 0
)
    {
      return await Mediator.Send(new GetLocationHistoryQuery
      {
        LocationId = id,
        Needle = needle,
        Size = size,
        Skip = skip
      });
    }
  }
}
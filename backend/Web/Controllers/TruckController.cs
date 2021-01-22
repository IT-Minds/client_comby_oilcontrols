using Application.Common.Interfaces.Pagination;
using Application.Trucks.Queries;
using Application.Trucks.Queries.GetTruckInfo;
using Application.Trucks.Queries.GetTrucksPage;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers
{
  public class TruckController : ApiControllerBase
  {
    [HttpGet]
    public async Task<ActionResult<TruckInfoDto>> GetTruck([FromQuery] int id)
    {
      return await Mediator.Send(new GetTruckInfoQuery { TruckId = id });
    }

    [HttpGet("page")]
    [ResponseCache(Duration = 604800)]
    public async Task<ActionResult<PageResult<TruckInfoDto>>> GetTrucks(
      [FromQuery] string needle, [FromQuery] int size = 1000, [FromQuery] int? skip = 0
    )
    {
      return await Mediator.Send(new GetTrucksPageQuery
      {
        Needle = needle,
        Size = size,
        Skip = skip
      });
    }
  }
}
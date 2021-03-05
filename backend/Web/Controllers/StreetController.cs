using Application.Common.Interfaces.Pagination;
using Application.Streets.Queries.GetStreets;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;


namespace Web.Controllers
{
  public class StreetController : ApiControllerBase
  {
    [HttpGet]
    [ResponseCache(Duration = 604800)] // 7 week cache
    public async Task<ActionResult<PageResult<StreetDto>>> Get(
     [FromQuery] string needle = "", [FromQuery] int size = 1000, [FromQuery] int? skip = 0
    )
    {
      return await Mediator.Send(new GetStreetsQuery
      {
        Needle = needle,
        Size = size,
        Skip = skip
      });
    }
  }
}

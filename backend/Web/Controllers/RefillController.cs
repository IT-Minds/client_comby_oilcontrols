using Application.Refill.Commands.CreateRefill;
using Application.Common.Interfaces.Pagination;
using Application.Refills.Queries.GetRefills;
using Application.Refills.Queries.GetRefills.Location;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers
{
  public class RefillController : ApiControllerBase
  {
    [HttpGet]
    public async Task<ActionResult<PageResult<RefillDto>>> Get(
      [FromQuery] int needle, [FromQuery] int size, [FromQuery] int? skip = 0
    ){
      return await Mediator.Send(new GetRefillsLocationQuery{
        Size = size,
        Needle = needle,
        Skip = skip
      });
    }
    
    [HttpGet]
    public async Task<ActionResult<PageResult<RefillDto>>> Get(
      [FromQuery] string needle, [FromQuery] int size, [FromQuery] int? skip = 0
    ){
      return await Mediator.Send(new GetRefillsLocationQuery{
        Size = size,
        Needle = needle,
        Skip = skip
      });
    }
  }
}
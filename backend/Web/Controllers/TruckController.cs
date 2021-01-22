using Application.Trucks.Queries;
using Application.Trucks.Queries.GetTruckInfo;
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
  }
}
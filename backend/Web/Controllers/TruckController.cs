using Application.Trucks.Commands.UpdateTruck;
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

    [HttpPut]
    public async Task<ActionResult<string>> UpdateTruck(UpdateTruckCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}
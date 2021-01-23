using Application.Trucks.Commands.CreateTruck;
using Application.Common.Interfaces.Pagination;
using Application.Trucks.Commands.UpdateTruck;
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
    public async Task<ActionResult<TruckInfoDto>> GetTruck([FromQuery] string truckIdentifier)
    {
      return await Mediator.Send(new GetTruckInfoQuery { TruckIdentifier = truckIdentifier });
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

    [HttpPut("{id}")]
    public async Task<ActionResult<string>> UpdateTruck([FromRoute] int id, UpdateTruckCommand command)
    {
      if (command.Id != default(int) && command.Id != id)
      {
        // TODO Error
      }

      command.Id = id;
      return await Mediator.Send(command);
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateTruck(CreateTruckCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}

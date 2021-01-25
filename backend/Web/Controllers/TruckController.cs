using Application.Trucks.Commands.CreateTruck;
using Application.Common.Interfaces.Pagination;
using Application.Trucks.Commands.UpdateTruck;
using Application.Trucks.Queries;
using Application.Trucks.Queries.GetTruckInfo;
using Application.Trucks.Queries.GetTrucksPage;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Application.Locations;
using Application.Locations.Queries;

namespace Web.Controllers
{
  public class TruckController : ApiControllerBase
  {
    [HttpGet("{id}")]
    public async Task<ActionResult<TruckInfoDto>> GetTruck([FromRoute] int id)
    {
      return await Mediator.Send(new GetTruckInfoQuery { Id = id });
    }

    [HttpGet]
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

    [HttpGet("{id}/runList")]
    [ResponseCache(Duration = 43200)] // 12 hour cache
    public async Task<ActionResult<IList<LocationRefillDto>>> GetTrucksRefills([FromRoute] int id)
    {
      var result = await Mediator.Send(new GetLocationRequiringRefill
      {
        TruckId = id
      });
      if (result.Count <= 0)
      {
        return NoContent();
      }

      return result;
    }
  }
}

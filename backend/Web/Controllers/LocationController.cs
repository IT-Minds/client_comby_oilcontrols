using Application.Locations.Commands.AddDebtorToLocation;
using Application.Locations.Commands.AddLocationImage;
using Application.Locations.Commands.CreateLocation;
using Application.Locations.Commands.RemoveDebtorFromLocation;
using Application.Locations.Commands.UpdateDebtorOnLocation;
using Application.Locations.Commands.UpdateLocationMetaData;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers
{
  public class LocationController : ApiControllerBase
  {
    [HttpPut("{id}")]
    public async Task<ActionResult<int>> UpdateMetaData([FromRoute] int id, UpdateLocationMetaDataCommand command)
    {
      command.Id = id;
      return await Mediator.Send(command);
    }

    [HttpPost("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<string>> SaveLocationImage([FromRoute] int id, IFormFile file)
    {
      return await Mediator.Send(new AddLocationImageCommand
      {
        Picture = file,
        LocationId = id
      });
    }
    [HttpPost]
    public async Task<ActionResult<int>> AddNewLocation(CreateLocationCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpPost("addDebtor")]
    public async Task<ActionResult<int>> AddDebtor(AddDebtorToLocationCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpPut("updateDebtor")]
    public async Task<ActionResult<int>> UpdateDebtor(UpdateDebtorOnLocationCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpPut("removeDebtor")]
    public async Task<ActionResult<int>> RemoveDebtor(RemoveDebtorFromLocationCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}

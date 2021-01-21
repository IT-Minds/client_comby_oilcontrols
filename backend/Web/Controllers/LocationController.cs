using Application.Locations.Commands.AddLocationImageCommand;
using Application.Locations.Commands.UpdateLocationMetaData;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers
{
  public class LocationController : ApiControllerBase
  {
    [HttpPost("/UpdateMetaData")]
    public async Task<ActionResult<int>> UpdateMetaData(UpdateLocationMetaDataCommand command)
    {
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
  }
}

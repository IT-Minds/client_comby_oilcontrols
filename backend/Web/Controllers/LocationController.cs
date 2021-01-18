using Application.Locations.Commands.UpdateLocationMetaData;
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
  }
}

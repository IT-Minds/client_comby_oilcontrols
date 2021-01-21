using System.Threading.Tasks;
using Application.TruckRefills.Commands.CreateTruckRefill;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class TruckRefillController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<int>> CreateTruckRefill(CreateTruckRefillCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}
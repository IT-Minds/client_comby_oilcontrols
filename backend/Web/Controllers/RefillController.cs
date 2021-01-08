using Application.Refill.Commands.CreateRefill;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers
{
  public class RefillController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateRefillCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}

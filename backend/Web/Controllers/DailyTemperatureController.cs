using Application.DailyTemperatures;
using Application.DailyTemperatures.Commands.CreateDailyTemperature;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers
{
  public class DailyTemperatureController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<TemperatureIdDto>> Create(CreateDailyTemperatureCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}
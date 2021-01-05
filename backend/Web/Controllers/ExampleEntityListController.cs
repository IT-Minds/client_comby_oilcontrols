using Application.ExampleEntityLists.Commands.CreateExampleEntityList;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers
{
  public class ExampleEntityListController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateExampleEntityListCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}

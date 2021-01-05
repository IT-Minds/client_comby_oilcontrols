using Application.ExampleEntities.Commands.CreateExampleEntity;
using Application.ExampleEntities.Commands.DeleteExampleEntity;
using Application.ExampleEntities.Commands.UpdateExampleEntity;
using Application.ExampleEntities.Queries.GetExampleEntities;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Controllers
{

  public class ExampleEntityController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateExampleEntityCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateExampleEntityCommand command)
    {
      if (id != command.Id)
      {
        return BadRequest();
      }
      await Mediator.Send(command);

      return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
      await Mediator.Send(new DeleteExampleEntityCommand
      {
        Id = id
      });
      return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<ExampleEntitiesViewModel>> Get()
    {
      return await Mediator.Send(new GetExampleEntitiesQuery());
    }

  }
}

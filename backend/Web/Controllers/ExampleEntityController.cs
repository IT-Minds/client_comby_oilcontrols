using Application.Common.Interfaces.Pagination;
using Application.ExampleEntities.Commands.CreateExampleEntity;
using Application.ExampleEntities.Commands.DeleteExampleEntity;
using Application.ExampleEntities.Commands.UpdateExampleEntity;
using Application.ExampleEntities.Queries.GetExampleEntities;
using Application.ExampleEntities.Queries.GetExampleEntities.PageCreatedAt;
using Application.ExampleEntities.Queries.GetExampleEntities.PageName;
using Application.ExampleEntities.Queries.GetExampleEntities.PageUpdatedAt;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System;
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
    public async Task<ActionResult<PageResult<ExampleEntityDto>>> Get(
      [FromQuery] string needle, [FromQuery] int size, [FromQuery] string sortBy, [FromQuery] int? skip = 0
    )
    {
      try
      {
        switch (sortBy)
        {
          case "createdAt":
            return await Mediator.Send(new GetExampleEntitiesPageCreatedAtQuery
            {
              Needle = new System.DateTimeOffset(Int64.Parse(needle), new TimeSpan()),
              Size = size,
              Skip = skip
            });
          case "updatedAt":
            return await Mediator.Send(new GetExampleEntitiesPageUpdatedAtQuery
            {
              Needle = new System.DateTimeOffset(Int64.Parse(needle), new TimeSpan()),
              Size = size,
              Skip = skip
            });
          case "name":
            return await Mediator.Send(new GetExampleEntitiesPageNameQuery
            {
              Needle = needle,
              Size = size,
              Skip = skip
            });

          default:
            return BadRequest("Pagination SortBy now know.");
        }
      }
      catch (ValidationException e)
      {
        return BadRequest(e.Errors);
      }
    }
  }
}

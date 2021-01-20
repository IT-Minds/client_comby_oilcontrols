using Application.Common.Interfaces.Pagination;
using Application.ExampleEntities.Queries.GetExampleEntities.PageCreatedAt;
using Application.ExampleEntities.Queries.GetExampleEntities.PageName;
using Application.ExampleEntities.Queries.GetExampleEntities.PageUpdatedAt;
using Application.Streets.Queries.GetStreets;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;


namespace Web.Controllers
{
  public class StreetController : ApiControllerBase
  {
    [HttpGet]
    public async Task<ActionResult<PageResult<StreetDto>>> Get(
     [FromQuery] string needle, [FromQuery] int size, [FromQuery] int? skip = 0
    )
    {
      return await Mediator.Send(new GetStreetsQuery
      {
        Needle = needle,
        Size = size,
        Skip = skip
      });
    }
  }
}

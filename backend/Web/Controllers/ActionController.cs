using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Actions.Queries.GetAllActions;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class ActionController : ApiControllerBase
  {
    [HttpGet]
    public async Task<List<string>> GetAllActions()
    {
      return await Mediator.Send(new GetAllActionsQuery());
    }
  }
}
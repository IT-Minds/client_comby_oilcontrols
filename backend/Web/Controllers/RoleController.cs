using System.Threading.Tasks;
using Application.Roles;
using Application.Roles.Commands.CreateRole;
using Application.Roles.Commands.UpdateRole;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class RoleController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<RoleIdDto>> CreateRole(CreateRoleCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpPut]
    public async Task<ActionResult<RoleIdDto>> UpdateRole(UpdateRoleCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}
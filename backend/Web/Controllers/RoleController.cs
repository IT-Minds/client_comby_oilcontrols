using System.Threading.Tasks;
using Application.Common.Interfaces.Pagination;
using Application.Roles;
using Application.Roles.Commands.CreateRole;
using Application.Roles.Commands.UpdateRole;
using Application.Roles.Queries.GetAllRoles;
using Application.Roles.Queries.GetRole;
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

    [HttpGet("{id}")]
    public async Task<ActionResult<RoleIdDto>> GetRole([FromRoute] int id)
    {
      return await Mediator.Send(new GetRoleQuery { Id = id });
    }

    [HttpGet("AllRoles")]
    public async Task<ActionResult<PageResult<RoleIdDto, string>>> GetAllRole(
      [FromQuery] string needle = "", [FromQuery] int size = 1000, [FromQuery] int? skip = 0
    )
    {
      return await Mediator.Send(new GetAllRolesQuery
      {
        Needle = needle,
        Size = size,
        Skip = skip
      });
    }
  }
}

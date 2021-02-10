using System.Threading.Tasks;
using Application.Common.Interfaces.Pagination;
using Application.Users;
using Application.Users.Commands.CreateUser;
using Application.Users.Commands.UpdateUserRole;
using Application.Users.Queries.GetAllUsers;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class UserController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<int>> CreateUser(CreateUserCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpPut]
    public async Task<ActionResult<UserRoleDto>> UpdateUserRoles(UpdateUserRolesCommand command)
    {
      return await Mediator.Send(command);
    }

    [HttpGet]
    public async Task<ActionResult<PageResult<UserDto, int>>> GetAllUser(
      [FromQuery] int needle = 0, [FromQuery] int size = 1000, [FromQuery] int skip = 0
    )
    {
      return await Mediator.Send(new GetAllUsersQuery
      {
        Needle = needle,
        Size = size,
        Skip = skip
      });
    }

  }
}

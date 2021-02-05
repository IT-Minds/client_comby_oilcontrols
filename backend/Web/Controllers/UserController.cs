using System.Threading.Tasks;
using Application.Users.Commands.CreateUser;
using Application.Users.Commands.UpdateUserRole;
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

  }
}
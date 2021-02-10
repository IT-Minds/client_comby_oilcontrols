using System.Threading.Tasks;
using Application.Users;
using Application.Users.Commands.AssignToken;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class AuthenticationController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<UserTokenDto>> Login(AssignTokenCommand command)
    {
      var result = await Mediator.Send(command);
      return result;
    }

    [HttpPost("checkauth")]
    public async Task<ActionResult<UserIdDto>> CheckAuth()
    {
      var result = await Mediator.Send(new CheckAuthCommand());
      return result;
    }
  }
}

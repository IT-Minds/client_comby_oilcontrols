using System.Threading.Tasks;
using Application.Users.Commands.AssignToken;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class AuthenticationController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<UserTokenDto>> Login(AssignTokenCommand command)
    {
      return await Mediator.Send(command);
    }
  }
}
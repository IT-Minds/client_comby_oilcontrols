using System;
using System.Threading.Tasks;
using Application.Users.Commands.CreateUser;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
  public class UserController : ApiControllerBase
  {
    [HttpPost]
    public async Task<ActionResult<int>> CreateUser(CreateUserCommand command)
    {
      throw new NotImplementedException();
    }
  }
}
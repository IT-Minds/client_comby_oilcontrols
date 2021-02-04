using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Users
{
  public class UserDto : IAutoMap<User>
  {
    public string Username { get; set; }
    public string Password { get; set; }
  }
}
using System.Collections.Generic;

namespace Application.Users.UpdateUser
{
  public class UserRoleDto
  {
    public string Username { get; set; }
    public List<string> Roles { get; set; }
  }
}
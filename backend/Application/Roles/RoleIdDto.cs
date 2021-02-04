using AutoMapper;
using Domain.Entities;

namespace Application.Roles
{
  public class RoleIdDto : RoleDto
  {
    public int Id { get; set; }
  }
}
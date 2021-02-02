using AutoMapper;
using Domain.Entities;

namespace Application.Roles
{
  public class RoleIdDto : RoleDto
  {
    public int Id { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Role, RoleIdDto>()
        .IncludeBase<Role, RoleDto>();
    }
  }
}
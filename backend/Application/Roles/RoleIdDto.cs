using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Roles
{
  public class RoleIdDto : RoleDto, IAutoMap<Role>
  {
    public int Id { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Role, RoleIdDto>()
        .IncludeBase<Role, RoleDto>();
      ;
    }
  }
}

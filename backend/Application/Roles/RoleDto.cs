using System.Collections.Generic;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Roles
{
  public class RoleDto : IAutoMap<Role>
  {
    public string Name { get; set; }
    // public ICollection<Action> Actions { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Role, RoleDto>();
    }
  }
}

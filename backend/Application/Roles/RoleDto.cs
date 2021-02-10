using System.Collections.Generic;
using System.Linq;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Roles
{
  public class RoleDto : IAutoMap<Role>
  {
    public string Name { get; set; }
    public IEnumerable<Action> Actions { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Role, RoleDto>()
        .ForMember(dest => dest.Actions, opts => opts.MapFrom(from =>
          from.Actions.Select(x => x.Action)
        ))
      ;
    }
  }
}

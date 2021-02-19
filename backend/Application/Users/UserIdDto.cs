using System.Collections.Generic;
using System.Linq;
using Application.Common.Mappings;
using Application.Roles;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Users
{
  public class UserIdDto : UserDto, IAutoMap<User>
  {
    public int Id { get; set; }

    public bool IsTrucker { get => TruckId.HasValue; }

    public new void Mapping(Profile profile)
    {
      profile.CreateMap<User, UserIdDto>()
        .IncludeBase<User, UserDto>();
      ;
    }
  }
}

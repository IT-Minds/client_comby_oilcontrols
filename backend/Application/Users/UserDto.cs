using System.Linq;
using Application.Common.Mappings;
using Application.Roles;
using AutoMapper;
using Domain.Entities;

namespace Application.Users
{
  public class UserDto : IAutoMap<User>
  {
    public string Username { get; set; }
    public int? TruckId { get; set; }

    public RoleDto CurrentRole { get; set; }


    public void Mapping(Profile profile)
    {
      profile.CreateMap<User, UserDto>()
        .ForMember(dest => dest.CurrentRole, opts => opts.MapFrom(from =>
          from.Roles.FirstOrDefault().Role
        ))
      ;
    }
  }
}

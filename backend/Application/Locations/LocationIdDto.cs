using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Locations
{
  public class LocationIdDto : LocationDto, IAutoMap<Location>
  {
    public int Id { get; set; }

#pragma warning disable 0108
    public void Mapping(Profile profile)
    {
      profile.CreateMap<Location, LocationIdDto>()
        .IncludeBase<Location, LocationDto>();
    }
#pragma warning restore 0108
  }
}

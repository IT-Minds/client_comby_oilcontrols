using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Locations
{
  public class LocationIdDto : LocationDto, IAutoMap<Location>
  {
    public int Id { get; set; }


    public new void Mapping(Profile profile)
    {
      profile.CreateMap<Location, LocationIdDto>()
        .IncludeBase<Location, LocationDto>();
    }

  }
}

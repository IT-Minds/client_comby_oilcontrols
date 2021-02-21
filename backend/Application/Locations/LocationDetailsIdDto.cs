using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Locations
{
  public class LocationDetailsIdDto : LocationDetailsDto, IAutoMap<Location>
  {
    public int Id { get; set; }

#pragma warning disable 0108
    public void Mapping(Profile profile)
    {
      profile.CreateMap<Location, LocationDetailsIdDto>()
        .IncludeBase<Location, LocationDetailsDto>();
    }
#pragma warning restore 0108
  }
}

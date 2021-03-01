using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.EntityExtensions;
using Domain.Enums;

namespace Application.Locations
{
  public class LocationDetailsIdDto : LocationDetailsDto, IAutoMap<Location>
  {
    public int Id { get; set; }
    public DateTime PredictedFuelDate { get; set; }

#pragma warning disable 0108
    public void Mapping(Profile profile)
    {
      profile.CreateMap<Location, LocationDetailsIdDto>()
        .IncludeBase<Location, LocationDetailsDto>()
        .ForMember(dest => dest.PredictedFuelDate, opts => opts.MapFrom(x => x.PredictDayReachingMinimumFuelLevel(365)));
      ;
    }
#pragma warning restore 0108
  }
}

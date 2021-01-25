using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.LocationHistories.Queries
{
  public class LocationHistoryDto : IAutoMap<LocationHistory>
  {
    public int Id { get; set; }
    public int RegionId { get; set; }
    public RefillSchedule Schedule { get; set; }
    public string Address { get; set; }
    public string Comments { get; set; }
    public int LocationId { get; set; }
    public DateTime TimeOfChange { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<LocationHistory, LocationHistoryDto>()
      .ForMember(dest => dest.TimeOfChange, map => map.MapFrom(from => from.Created.DateTime));
    }
  }
}

using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Locations.Queries.GetDebtorHistory
{
  public class LocationDebtorHistoryDto : IAutoMap<LocationDebtorHistory>
  {
    public int LocationId { get; set; }
    public int DebtorId { get; set; }
    public LocationDebtorType Type { get; set; }
    public DateTime TimeOfChange { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<LocationDebtorHistory, LocationDebtorHistoryDto>()
      .ForMember(dest => dest.TimeOfChange, map => map.MapFrom(from => from.Created.DateTime));
    }
  }
}
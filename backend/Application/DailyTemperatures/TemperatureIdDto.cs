using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.DailyTemperatures
{
  public class TemperatureIdDto : TemperatureDto, IAutoMap<RegionDailyTemp>
  {
    public int Id { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<RegionDailyTemp, TemperatureIdDto>()
        .IncludeBase<RegionDailyTemp, TemperatureDto>();
    }
  }
}
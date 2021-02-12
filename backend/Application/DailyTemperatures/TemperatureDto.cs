using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.DailyTemperatures
{
  public class TemperatureDto : IAutoMap<RegionDailyTemp>
  {
    public int RegionId { get; set; }
    public DateTime Date { get; set; }
    public double Temperature { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<RegionDailyTemp, TemperatureDto>();
    }
  }
}
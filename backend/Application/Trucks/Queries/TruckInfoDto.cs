using System;
using System.Collections.Generic;
using System.Linq;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Trucks.Queries
{
  public class TruckInfoDto : IAutoMap<Truck>
  {
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public double MorningQuantity { get; set; }
    public double EveningQuantity { get; set; }
    public List<TruckRefillDto> TruckRefills { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Truck, TruckInfoDto>()
        .ForMember(dest => dest.MorningQuantity,
          map =>
          {
            map.MapFrom(from => from.DailyStates
            .Where(x => x.TruckId == from.Id)
            .OrderByDescending(x => x.Date)
            .FirstOrDefault()
            .MorningQuantity);
          })
        .ForMember(dest => dest.EveningQuantity,
          map =>
          {
            map.MapFrom(from => from.DailyStates
            .Where(x => x.TruckId == from.Id)
            .OrderByDescending(x => x.Date)
            .FirstOrDefault()
            .EveningQuantity);
          })
        .ForMember(dest => dest.Date,
          map =>
          {
            map.MapFrom(from => from.DailyStates
            .Where(x => x.TruckId == from.Id)
            .OrderByDescending(x => x.Date)
            .FirstOrDefault()
            .Date);
          })
       .ForMember(dest => dest.TruckRefills,
         map =>
         {
           map.MapFrom(from =>
           from.DailyStates
           .Where(x => x.TruckId == from.Id)
           .OrderByDescending(x => x.Date)
           .FirstOrDefault()
           .TruckRefills
           );
         });
    }
  }
}
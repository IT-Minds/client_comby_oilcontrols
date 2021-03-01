using System;
using System.Linq;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Locations
{
  public class LocationDto : IAutoMap<Location>
  {
    public string Address { get; set; }
    public string AddressExtra { get; set; }
    public string Comments { get; set; }
    public int RegionId { get; set; }
    public RefillSchedule Schedule { get; set; }
    public double EstimateFuelConsumption { get; set; }
    public int DaysBetweenRefills { get; set; }
    public int? MainDebtorId { get; set; }
    public int? BaseDebtorId { get; set; }
    public int? UpcomingDebtorId { get; set; }

    public DateTime? DebtorChangeDate { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Location, LocationDto>()
      .ForMember(dest => dest.MainDebtorId, map => map.MapFrom(from => from.Debtors.Where(x => x.Type == LocationDebtorType.MAIN).Select(x => x.DebtorId).FirstOrDefault()
      ))
      .ForMember(dest => dest.BaseDebtorId, map => map.MapFrom(from => from.Debtors.Where(x => x.Type == LocationDebtorType.BASE).Select(x => x.DebtorId).FirstOrDefault()
      ))
      .ForMember(dest => dest.UpcomingDebtorId, map => map.MapFrom(from => from.Debtors.Where(x => x.Type == LocationDebtorType.UPCOMING).Select(x => x.DebtorId).FirstOrDefault()
      ))
      .ForMember(dest => dest.DebtorChangeDate, map => map.MapFrom(from => from.Debtors.Where(x => x.Type == LocationDebtorType.UPCOMING).Select(x => x.DebtorChangeDate).FirstOrDefault()
      ));


    }

  }
}

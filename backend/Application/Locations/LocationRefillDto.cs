using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Entities.Refills;
using Domain.Enums;

namespace Application.Locations
{
  public class LocationRefillDto : IAutoMap<OrderedRefill>
  {
    public int RefillId { get; set; }
    public int LocationId { get; set; }
    public int RegionId { get; set; }
    public RefillSchedule Schedule { get; set; }
    public TankType LocationType { get; set; }
    public FuelType FuelType { get; set; }
    public string Address { get; set; }
    public string AddressExtra { get; set; }
    public DateTime ExpectedDeliveryDate { get; set; }
    public bool DebtorBlocked { get; set; } = false; // TODO map real data


    public void Mapping(Profile profile)
    {
      profile.CreateMap<OrderedRefill, LocationRefillDto>()
      .ForMember(dest => dest.RefillId, map => map.MapFrom(from => from.Id))

      .ForMember(dest => dest.RegionId, map => map.MapFrom(from => from.Location.RegionId))

      .ForMember(dest => dest.Schedule, map => map.MapFrom(from => from.Location.Schedule))

      .ForMember(dest => dest.Address, map => map.MapFrom(from => from.Location.Address))
      .ForMember(dest => dest.AddressExtra, map => map.MapFrom(from => from.Location.AddressExtra))

      .ForMember(dest => dest.LocationType,
          map => map.MapFrom(from => from.Location.FuelTank.TankType))

      .ForMember(dest => dest.FuelType,
          map => map.MapFrom(from => from.Location.FuelTank.FuelType))

      .ForMember(dest => dest.DebtorBlocked, map => map.Ignore())

      ;
    }
  }
}

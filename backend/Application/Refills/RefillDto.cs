using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Entities.Refills;
using Domain.Enums;

namespace Application.Refills
{
  public class RefillDto : IAutoMap<CompletedRefill>
  {
    public int Id { get; set; }
    public DateTime ExpectedDeliveryDate { get; set; }
    public DateTime ActualDeliveryDate { get; set; }

    public TankType LocationType { get; set; }

    public int CouponId { get; set; }
    public int TruckId { get; set; }
    public double StartAmount { get; set; }
    public double EndAmount { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<CompletedRefill, RefillDto>()
        .ForMember(dest => dest.TruckId,
          map => map.MapFrom(from => from.TruckId))
        .ForMember(dest => dest.LocationType,
          map => map.MapFrom(from => from.Location.FuelTank.TankType));
    }
  }
}

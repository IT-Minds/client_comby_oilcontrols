using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Refill.Queries.GetRefills
{
  public class RefillDto : IAutoMap<Domain.Entities.Refill>
  {
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public int CouponId { get; set; }
    public int TruckId { get; set; }
    public double StartAmount { get; set; }
    public double EndAmount { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Domain.Entities.Refill, RefillDto>()
        .ForMember(dest => dest.Id,
          map => map.MapFrom(from => from.Id))
        .ForMember(dest => dest.Date,
          map => map.MapFrom(from => from.Date))
        .ForMember(dest => dest.CouponId,
          map => map.MapFrom(from => from.CouponId))
        .ForMember(dest => dest.TruckId,
          map => map.MapFrom(from => from.Coupon.TruckId))
        .ForMember(dest => dest.StartAmount, 
          map => map.MapFrom(from => from.StartAmount))
        .ForMember(dest => dest.EndAmount, 
          map => map.MapFrom(from => from.EndAmount));;
    }
  }
}

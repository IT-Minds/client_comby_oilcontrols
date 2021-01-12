using System;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Coupons.Queries.GetCoupons
{
  public class CouponDto : IAutoMap<Domain.Entities.Coupon>
  {
    public int CouponNumber { get; set; }
    public int TruckId { get; set; }
    public CouponStatus Status { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Coupon, CouponDto>()
        .ForMember(dest => dest.CouponNumber,
          map => map.MapFrom(from => from.CouponNumber))
        .ForMember(dest => dest.TruckId,
          map => map.MapFrom(from => from.TruckId))
        .ForMember(dest => dest.Status,
          map => map.MapFrom(from => from.Status));
    }
  }
}
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
  }
}
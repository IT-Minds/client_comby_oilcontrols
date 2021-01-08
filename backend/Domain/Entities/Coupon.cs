using System;
using Domain.Common;
using Domain.Enums;
using System.Collections.Generic;

namespace Domain.Entities
{
  public class Coupon : AuditableEntity
  {
    public int Id { get; set; }
    public Truck Truck { get; set; }
    public CouponStatus Status { get; set; }
  }
}

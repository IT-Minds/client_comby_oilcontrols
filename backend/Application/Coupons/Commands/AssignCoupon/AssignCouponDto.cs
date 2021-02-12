using System.Collections.Generic;

namespace Application.Coupons.Commands.AssignCoupons
{
  public class AssignCouponDto
  {
    public int TruckId { get; set; }
    public List<int> CouponNumbers { get; set; }
  }
}
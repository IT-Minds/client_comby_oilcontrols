using Domain.Enums;

namespace Application.Coupons.Commands.UpdateCouponStatus
{
  public class CouponStatusDto
  {
    public int CouponNumber { get; set; }
    public CouponStatus Status { get; set; } = CouponStatus.DESTROYED;
  }
}
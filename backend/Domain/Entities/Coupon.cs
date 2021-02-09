using Domain.Common;
using Domain.Entities.Refills;
using Domain.Enums;

namespace Domain.Entities
{
  public class Coupon : AuditableEntity
  {
    public int Id { get; set; }
    public int CouponNumber { get; set; }
    public Truck Truck { get; set; }
    public int TruckId { get; set; }
    public CouponStatus Status { get; set; }

    public int RefillId { get; set; }
    public CompletedRefill Refill { get; set; }
  }
}

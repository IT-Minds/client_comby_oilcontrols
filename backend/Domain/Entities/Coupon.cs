using Domain.Common;

namespace Domain.Entities
{
  public class Coupon : AuditableEntity
  {
    public int Id { get; set; }
    public int CouponNumber { get; set; }
    public Truck Truck { get; set; }
    public int TruckId { get; set; }
  }
}

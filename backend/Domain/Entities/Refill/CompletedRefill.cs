using System;
using Domain.Enums;

namespace Domain.Entities.Refills
{
  public class CompletedRefill : AssignedRefill
  {

    public DateTime ActualDeliveryDate { get; set; }
    public int RefillNumber { get; set; }
    public int CouponId { get; set; }
    public Coupon Coupon { get; set; }
    public double StartAmount { get; set; }
    public double EndAmount { get; set; }
    public TankState TankState { get; set; }

    public new RefillState RefillState { get; set; } = RefillState.COMPLETED;

    public CompletedRefill() { }
    public CompletedRefill(AssignedRefill obj)
    {
      this.TruckId = obj.TruckId;
      this.Id = obj.Id;
      this.ExpectedDeliveryDate = obj.ExpectedDeliveryDate;
      this.LocationId = obj.LocationId;
      this.RefillState = RefillState.COMPLETED;
    }
  }
}

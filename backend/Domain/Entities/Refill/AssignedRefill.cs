namespace Domain.Entities.Refills
{
  public class AssignedRefill : OrderedRefill
  {

    // Refill is Assigned
    public int TruckId { get; set; }
    public Truck Truck { get; set; }

    public new RefillState RefillState { get; set; } = RefillState.ASSIGNED;

    public AssignedRefill() { }
    public AssignedRefill(OrderedRefill obj)
    {
      this.Id = obj.Id;
      this.ExpectedDeliveryDate = obj.ExpectedDeliveryDate;
      this.LocationId = obj.LocationId;
      this.RefillState = RefillState.ASSIGNED;
    }
  }
}

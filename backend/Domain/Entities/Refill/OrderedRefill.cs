using System;
using Domain.Common;

namespace Domain.Entities.Refills
{
  public class OrderedRefill : AuditableEntity
  {
    // Refill is Ordered
    public int Id { get; set; }
    public DateTime ExpectedDeliveryDate { get; set; }
    public int LocationId { get; set; }
    public Location Location { get; set; }

    public RefillState RefillState { get; set; } = RefillState.ORDERED;
  }
}

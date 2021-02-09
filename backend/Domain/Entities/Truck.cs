using System.Collections.Generic;
using System.Linq;
using Domain.Common;
using Domain.Entities.Refills;

namespace Domain.Entities
{
  public class Truck : AuditableEntity
  {
    public int Id { get; set; }
    public ICollection<TruckDailyState> DailyStates { get; set; }
    public string TruckIdentifier { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double TankCapacity { get; set; }
    public int RefillNumber { get; set; }
    public ICollection<AssignedRefill> Refills { get; set; }
    public virtual IEnumerable<CompletedRefill> CompletedRefills { get {
      return this.Refills.Where(x => x.RefillState == RefillState.COMPLETED).OfType<CompletedRefill>();
    } }
  }
}

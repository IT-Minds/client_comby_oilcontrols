using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
  public class Truck : AuditableEntity
  {
    public int Id { get; set; }
    public Route Route { get; set; }
    public int? RouteId { get; set; }
    public ICollection<TruckDailyState> DailyStates { get; set; }
  }
}

using System.Collections.Generic;
using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class LocationHistory : AuditableEntity
  {
    public int Id { get; set; }
    public int RegionId { get; set; }
    public Region Region { get; set; }
    public RefillSchedule Schedule { get; set; }
    public string Address { get; set; }
    public string Comments { get; set; }
    public int LocationId { get; set; }
    public Location Location { get; set; }
    public int DaysBetweenRefills { get; set; }
    public double EstimateFuelConsumption { get; set; }
  }
}

using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
  public class Debtor : AuditableEntity
  {
    public int Id { get; set; }
    public ICollection<Location> Locations { get; set; }
    public ICollection<Location> UpcomingLocations { get; set; }
    public ICollection<Location> AdministeredLocations { get; set; }
  }
}
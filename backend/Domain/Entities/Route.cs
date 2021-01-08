using Domain.Common;
using System.Collections.Generic;

namespace Domain.Entities
{
  public class Route : AuditableEntity
  {
    public int Id { get; set; }
    public ICollection<Refill> Refills { get; set; }
  }
}

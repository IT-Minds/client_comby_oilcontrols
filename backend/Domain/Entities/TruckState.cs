using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
  public class TruckState : AuditableEntity
  {
    public int Id { get; set; }
    public double MorningQuantity { get; set; }
    public double EveningQuantity { get; set; }
    public ICollection<TruckRefill> Refills { get; set; }
  }
}
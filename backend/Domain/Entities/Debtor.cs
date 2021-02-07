using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
  public class Debtor : AuditableEntity
  {
    public int Id { get; set; }

    public int UnicontaId { get; set; }
    public ICollection<LocationDebtor> Locations { get; set; }
    public ICollection<LocationDebtorHistory> LocationsHistory { get; set; }
    public bool CouponRequired { get; set; }
  }
}

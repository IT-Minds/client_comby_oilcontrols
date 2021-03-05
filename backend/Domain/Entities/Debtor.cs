using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
  public class Debtor : AuditableEntity
  {
    public int Id { get; set; }

    public int UnicontaId { get; set; }
    public bool Blocked {get; set;} // UNICONTA DATA
    public string AccountNumber {get; set;} // UNICONTA DATA
    public string Name {get; set;} // UNICONTA DATA
    public string GLN {get; set;} // UNICONTA DATA
    public ICollection<LocationDebtor> Locations { get; set; }
    public ICollection<LocationDebtorHistory> LocationsHistory { get; set; }
    public bool CouponRequired { get; set; }
  }
}

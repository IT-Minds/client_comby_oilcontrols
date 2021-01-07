using System;
using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class Refill : AuditableEntity
  {
    public int Id { get; set; }
    public int CouponNumber { get; set; }
    public FuelType Type { get; set; }
    public int Amount { get; set; }
    public bool IsTankFull { get; set; }
    public DateTime date { get; set; }
  }
}

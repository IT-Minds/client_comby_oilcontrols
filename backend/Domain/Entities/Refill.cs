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
    public TankState TankState { get; set; }
    public DateTime Date { get; set; }
    public Building Building { get; set; }
  }
}

using System;
using Domain.Common;

namespace Domain.Entities
{
  public class TruckRefill : AuditableEntity
  {
    public int Id { get; set; }
    public DateTime TimeStamp { get; set; }
    public string FuelcardNumber { get; set; }
    public double amount { get; set; }
    public int TruckStateId { get; set; }
    public TruckState TruckState { get; set; }
  }
}
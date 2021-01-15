using System;
using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class TruckRefill : AuditableEntity
  {
    public int Id { get; set; }
    public DateTime TimeStamp { get; set; }
    public int FuelCardNumber { get; set; }
    public double Amount { get; set; }
    public FuelType FuelType { get; set; }
    public int TruckDailyStateId { get; set; }
    public TruckDailyState TruckDailyState { get; set; }
  }
}
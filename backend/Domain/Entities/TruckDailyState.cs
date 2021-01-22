using System;
using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
  public class TruckDailyState : AuditableEntity
  {
    public int Id { get; set; }
    public int TruckId { get; set; }
    public Truck Truck { get; set; }
    public DateTime Date { get; set; }
    public double MorningQuantity { get; set; }
    public double EveningQuantity { get; set; }
    public ICollection<TruckRefill> TruckRefills { get; set; }
    //TODO: Should probably specify what type of fuel is currently contained within the truck.
    public int StartRefillNumber { get; set; }
  }
}

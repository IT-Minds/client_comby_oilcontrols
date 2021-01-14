using System;
using Domain.Common;

namespace Domain.Entities{
  public class RegionDailyTemp : AuditableEntity
  {
    public int Id { get; set; }
    public int RegionId { get; set; }
    public Region Region { get; set; }
    public DateTime Date { get; set; }
    public double Temperature { get; set; }
  }
}
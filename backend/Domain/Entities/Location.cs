using System;
using System.Collections.Generic;
using System.Linq;
using Domain.Common;
using Domain.Entities.Refills;
using Domain.Enums;

namespace Domain.Entities
{
  public class Location : AuditableEntity
  {
    public int Id { get; set; }
    public int RegionId { get; set; }
    public Region Region { get; set; }
    public FuelTank FuelTank { get; set; }
    public int FuelTankId { get; set; }
    public RefillSchedule Schedule { get; set; }
    public string Address { get; set; }
    public string AddressExtra { get; set; }
    public string Comments { get; set; }
    public TankType TankType { get; set; }

    public string TankNumber { get; set; }
    public ICollection<OrderedRefill> Refills { get; set; }
    public virtual IEnumerable<AssignedRefill> AssignedRefills
    {
      get
      {
        return this.Refills.Where(x => x.RefillState == RefillState.ASSIGNED).OfType<AssignedRefill>();
      }
    }
    public virtual IEnumerable<CompletedRefill> CompletedRefills
    {
      get
      {
        return this.Refills.Where(x => x.RefillState == RefillState.COMPLETED).OfType<CompletedRefill>();
      }
    }
    public ICollection<LocationHistory> LocationHistories { get; set; }
    //Used with the interval schedule type.
    public int DaysBetweenRefills { get; set; }
    //Estimate consumption is assumed to be fuel consumed / opvarmningsgrad.
    public double EstimateFuelConsumption { get; set; }
    public ICollection<LocationDebtor> Debtors { get; set; }
    public ICollection<LocationDebtorHistory> DebtorsHistory { get; set; }

    public DateTime InactiveSince { get; set; }
  }
}

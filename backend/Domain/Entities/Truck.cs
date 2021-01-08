using System;
using Domain.Common;
using Domain.Enums;
using System.Collections.Generic;

namespace Domain.Entities
{
  public class Truck : AuditableEntity
  {
    public int Id { get; set; }
    public Route Route { get; set; }
  }
}
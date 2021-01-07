using System;
using Domain.Common;
using Domain.Enums;
using System.Collections.Generic;
namespace Domain.Entities
{
  public class Route : AuditableEntity
  {
    public int Id { get; set; }
    public ICollection<Location> Locations { get; set; }
  }
}

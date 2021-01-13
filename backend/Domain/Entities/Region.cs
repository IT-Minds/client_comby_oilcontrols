using System;
using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
  public class Region : AuditableEntity {
    public int Id { get; set; }
    public ICollection<Location> Locations { get; set; }
  }
}
using System.Collections.Generic;
using Domain.Common;

namespace Domain.Entities
{
  public class Role : AuditableEntity
  {
    public int Id { get; set; }
    public ICollection<RoleAction> Actions { get; set; }
  }
}
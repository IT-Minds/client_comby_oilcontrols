using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
  public class ExampleEntity : AuditableEntity
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public ExampleEnum ExampleEnum { get; set; }
    public virtual ExampleEntityList ExampleEntityList { get; set; }
    public int? ExampleEntityListId { get; set; }
  }
}

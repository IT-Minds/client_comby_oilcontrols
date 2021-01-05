using System.Collections.Generic;

namespace Domain.Entities
{
  public class ExampleEntityList
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<ExampleEntity> ExampleEntities { get; set; }
  }
}

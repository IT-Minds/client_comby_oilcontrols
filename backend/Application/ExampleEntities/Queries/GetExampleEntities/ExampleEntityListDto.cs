using Application.Common.Mappings;
using Domain.Entities;

namespace Application.ExampleEntities.Queries.GetExampleEntities
{
  public class ExampleEntityListDto : IAutoMap<ExampleEntityList>
  {
    public int Id { get; set; }
    public string Name { get; set; }
  }
}

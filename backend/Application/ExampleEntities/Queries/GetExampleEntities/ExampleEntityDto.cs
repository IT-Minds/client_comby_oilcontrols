using Application.Common.Mappings;
using Domain.Entities;
using Domain.Enums;

namespace Application.ExampleEntities.Queries.GetExampleEntities
{
  public class ExampleEntityDto : IAutoMap<ExampleEntity>
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public ExampleEntityListDto ExampleEntityList { get; set; }
    public ExampleEnum ExampleEnum { get; set; }
  }
}

using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.ExampleEntities.Queries.GetExampleEntities
{
  public class ExampleEntityDto : IAutoMap<ExampleEntity>
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public ExampleEnum ExampleEnum { get; set; }

    public string CreatedAt { get; set; }
    public string UpdatedAt { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<ExampleEntity, ExampleEntityDto>()
        .ForMember(dest => dest.CreatedAt,
          map => map.MapFrom(from => from.Created.UtcTicks.ToString()))
        .ForMember(dest => dest.UpdatedAt,
          map => map.MapFrom(from => from.LastModified.UtcTicks.ToString()));;
    }
  }
}

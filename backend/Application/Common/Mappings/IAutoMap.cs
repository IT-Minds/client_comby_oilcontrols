using AutoMapper;

namespace Application.Common.Mappings
{
  //TODO Figure better name
  public interface IAutoMap<T>
  {
    void Mapping(Profile profile) => profile.CreateMap(typeof(T), GetType());

  }
}

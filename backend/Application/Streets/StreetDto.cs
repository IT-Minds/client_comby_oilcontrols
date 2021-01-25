using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Streets.Queries.GetStreets
{
  public class StreetDto : IAutoMap<Street>
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public int RegionId { get; set; }
  }
}

using System;
using System.Collections.Generic;
using System.Linq;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using Domain.EntityExtensions;

namespace Application.Trucks.Queries
{
  public class TruckInfoDto : IAutoMap<Truck>
  {
    public int Id { get; set; }
    public string TruckIdentifier { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double TankCapacity { get; set; }
    public int RefillNumber { get; set; }

    public void Mapping(Profile profile)
    {
      profile.CreateMap<Truck, TruckInfoDto>()
        .ForMember(dest => dest.RefillNumber,
          map => map.MapFrom(from => from.CurrentRefillNumber()));
    }
  }
}
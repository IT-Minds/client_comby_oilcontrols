using System;
using System.Collections.Generic;
using System.Linq;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Trucks.Queries
{
  public class TruckInfoDto : IAutoMap<Truck>
  {
    //TODO: Update DTO once the Truck entities have been expanded with name, truck-number, description, and tanksize.
    public int Id { get; set; }
  }
}
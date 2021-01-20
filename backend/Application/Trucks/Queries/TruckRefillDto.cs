using System;
using Application.Common.Mappings;
using Domain.Entities;
using Domain.Enums;

namespace Application.Trucks.Queries
{
  public class TruckRefillDto : IAutoMap<TruckRefill>
  {
    public int Id { get; set; }
    public DateTime TimeStamp { get; set; }
    public int FuelCardNumber { get; set; }
    public double Amount { get; set; }
    public FuelType FuelType { get; set; }
  }
}
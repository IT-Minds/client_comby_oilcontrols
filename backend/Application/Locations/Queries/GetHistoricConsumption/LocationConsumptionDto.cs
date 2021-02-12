using System;

namespace Application.Locations.Queries.GetHistoricConsumption
{
    public class LocationConsumptionDto 
    {
        public string Address { get; set; }
        public int LocationId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double FuelConsumed { get; set; }
    }
}
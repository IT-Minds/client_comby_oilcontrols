using System;

namespace Application.Stats.GetHistoricConsumption
{
    public class LocationConsumptionDto
    {
        public string Address { get; set; }
        public string AddressExtra { get; set; }
        public int LocationId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double FuelConsumed { get; set; }
    }
}

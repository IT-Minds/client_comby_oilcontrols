using System;
using Domain.Enums;

namespace Application.Locations.Queries.GetHistoricConsumption
{
    public class HistoricConsumptionDto 
    {
        public int LocationId { get; set; }
        public Interval Interval { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
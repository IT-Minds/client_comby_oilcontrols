using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class LocationDebtorHistory : AuditableEntity
    {
        public int Id { get; set; }
        public int LocationDebtorId { get; set; }

        public LocationDebtorType Type { get; set; }
        public int LocationId { get; set; }
        public Location Location { get; set; }
        public int DebtorId { get; set; }
        public Debtor Debtor { get; set; }
    }
}

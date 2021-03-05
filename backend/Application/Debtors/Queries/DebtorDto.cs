using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Debtors.Queries
{
  public class DebtorDto: IAutoMap<Debtor>
  {
    public int Id {get; set;}
    public int UnicontaId {get; set;}
    public bool Blocked {get; set;}
    public string AccountNumber {get; set;}
    public string Name {get; set;}
    public string GLN {get; set;}
    public bool CouponRequired {get; set;}
  }
}

using System.Collections.Generic;
using System.Threading.Tasks;
using UniContaDomain.Entities;

namespace Application.Common.Interfaces
{
  public interface IUniContaService
  {
    Task<bool> Login();
    Task<IEnumerable<UniContaDebtor>> GetDebtors();
    Task<bool> CreateOrder(UniContaOrder inputOrder);
  }
}

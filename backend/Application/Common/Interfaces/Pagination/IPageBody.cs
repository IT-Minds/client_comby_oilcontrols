using System.Linq;
using System.Threading.Tasks;
using Domain.Common;

namespace Application.Common.Interfaces.Pagination
{

  public interface IPageBody<T, U> where T : AuditableEntity
  {
    int Size { get; set; }
    int? Skip { get; set; }

    U Needle { get; set; }

    U GetNewNeedle(IQueryable<T> query);

    IQueryable<T> PreparePage(IQueryable<T> query);

    Task<int> PagesRemaining(IQueryable<T> query);
  }

}

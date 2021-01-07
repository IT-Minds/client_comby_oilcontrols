using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace Application.Common.Interfaces
{
  public interface IPageRequest<T> : IRequest<PageResult<T>>
  {
    int Size { get; set; }

    int Skip { get; set; }

    string SortBy { get; set; }
  }

  public interface IPageRequestHandler<T, U> : IRequestHandler<T, PageResult<U>> where T : IPageRequest<U>
  {
    Task<PageResult<U>> Handle(T request, CancellationToken cancellationToken);
  }
}

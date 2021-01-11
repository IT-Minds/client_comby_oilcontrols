using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace Application.Common.Interfaces.Pagination
{
  public interface IPageRequest<T> : IRequest<PageResult<T>>
  {
  }

  public interface IPageRequestHandler<T, U> : IRequestHandler<T, PageResult<U>> where T : IPageRequest<U>
  {
    new Task<PageResult<U>> Handle(T request, CancellationToken cancellationToken);
  }
}

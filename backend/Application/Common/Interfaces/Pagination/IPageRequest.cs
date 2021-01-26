using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace Application.Common.Interfaces.Pagination
{
  public interface IPageRequest<T, V> : IRequest<PageResult<T, V>>
  {
  }

  public interface IPageRequest<T> : IRequest<PageResult<T>>
  {
  }


  public interface IPageRequestHandler<T, U, V> : IRequestHandler<T, PageResult<U, V>> where T : IPageRequest<U, V>
  {
    new Task<PageResult<U, V>> Handle(T request, CancellationToken cancellationToken);
  }

  public interface IPageRequestHandler<T, U> : IRequestHandler<T, PageResult<U>> where T : IPageRequest<U>
  {
    new Task<PageResult<U>> Handle(T request, CancellationToken cancellationToken);
  }

}

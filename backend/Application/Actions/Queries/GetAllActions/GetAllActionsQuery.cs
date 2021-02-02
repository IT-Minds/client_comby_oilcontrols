using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Pagination;
using Domain.Enums;
using MediatR;

namespace Application.Actions.Queries.GetAllActions
{
  public class GetAllActionsQuery : IRequest<List<string>>
  {
    public class GetAllActionsQueryHandler : IRequestHandler<GetAllActionsQuery, List<string>>
    {
      private readonly IApplicationDbContext _context;

      public GetAllActionsQueryHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<List<string>> Handle(GetAllActionsQuery request, CancellationToken cancellationToken)
      {
        return System.Enum.GetNames(typeof(Action)).Cast<string>().ToList();
      }
    }
  }
}
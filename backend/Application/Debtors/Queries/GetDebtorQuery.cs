using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Security;
using Application.Common.Services;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Debtors.Queries
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_DEBTOR)]
  public class GetDebtorQuery : IRequest<List<DebtorDto>>
  {
    public class GetDebtorQueryHandler : IRequestHandler<GetDebtorQuery, List<DebtorDto>>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;
      private readonly SynchronizeDebtorService _syncroniceDebtorService;

      public GetDebtorQueryHandler(IApplicationDbContext context, IMapper mapper, IUniContaService uniContaService, SynchronizeDebtorService syncroniceDebtorService)
      {
        _context = context;
        _mapper = mapper;
        _syncroniceDebtorService = syncroniceDebtorService;
      }

      public async Task<List<DebtorDto>> Handle(GetDebtorQuery request, CancellationToken cancellationToken)
      {
        var result = await _context.Debtors
          .ProjectTo<DebtorDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);

        return result;
      }
    }
  }
}

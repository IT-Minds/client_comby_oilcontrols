using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Services;
using AutoMapper;
using MediatR;

namespace Application.Debtors.Queries
{
  // [AuthorizeAttribute(Domain.Enums.Action.GET_DEBTOR)]
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
        _syncroniceDebtorService.SetDebtorQuery(
          _context.Debtors
        // .Include(x => x.Locations)
        );

        var result = await _syncroniceDebtorService.SyncroniceDebtor();

        var debtorDtos = new List<DebtorDto>();
        foreach (var (a, b) in result)
        {
          debtorDtos.Add(new DebtorDto
          {
            DbId = b.Id,
            UnicontaId = a.RowId,
            Blocked = a.Blocked,
            AccountNumber = a.AccountNumber,
            Name = a.Name,
            GLN = a.GLN,
            CouponRequired = b.CouponRequired
          });
        }

        return debtorDtos;
      }
    }
  }
}

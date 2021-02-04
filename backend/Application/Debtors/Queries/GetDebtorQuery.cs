using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using AutoMapper;
using MediatR;
using UniContaDomain.Entities;

namespace Application.Trucks.Queries.GetTruckInfo
{
  public class GetDebtorQuery : IRequest<bool>
  {
    public class GetDebtorQueryHandler : IRequestHandler<GetDebtorQuery, bool>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;
      private readonly IUniContaService _uniContaService;

      public GetDebtorQueryHandler(IApplicationDbContext context, IMapper mapper, IUniContaService uniContaService)
      {
        _context = context;
        _mapper = mapper;
        _uniContaService = uniContaService;
      }

      public async Task<bool> Handle(GetDebtorQuery request, CancellationToken cancellationToken)
      {
        await _uniContaService.Login();

        var result = await _uniContaService.GetDebtors();

        return result.FirstOrDefault().Blocked;
      }
    }
  }
}

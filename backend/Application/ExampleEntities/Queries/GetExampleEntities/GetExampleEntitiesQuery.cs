using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.ExampleEntities.Queries.GetExampleEntities
{
  public class GetExampleEntitiesQuery : IRequest<ExampleEntitiesViewModel>
  {
    public class GetExampleEntitiesQueryHandler : IRequestHandler<GetExampleEntitiesQuery, ExampleEntitiesViewModel>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetExampleEntitiesQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }
      public async Task<ExampleEntitiesViewModel> Handle(GetExampleEntitiesQuery request, CancellationToken cancellationToken)
      {
        var viewModel = new ExampleEntitiesViewModel
        {
          ExampleEntities = await _context.ExampleEntities
                .Include(x => x.ExampleEntityList)
                .ProjectTo<ExampleEntityDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken)
        };


        return viewModel;
      }
    }
  }
}

using Application.Common;
using Application.Common.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.ExampleEntities.Queries.GetExampleEntities
{
  public class GetExampleEntitiesQuery : IPageRequest<ExampleEntityDto>
  {
    public int Size { get; set; } = 100;
    public int Skip { get; set; } = 0;
    public string SortBy { get; set; } = "CreatedBy";

    public class GetExampleEntitiesQueryHandler : IPageRequestHandler<GetExampleEntitiesQuery, ExampleEntityDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetExampleEntitiesQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<ExampleEntityDto>> Handle(GetExampleEntitiesQuery request, CancellationToken cancellationToken)
      {

        var page = new PageResult<ExampleEntityDto>();

        page.Results = await _context.ExampleEntities
                .Skip(request.Skip)
                .Take(request.Size)
                // .OrderBy(request.SortBy) // TODO figure out if we wanna use an enum or some sort of attribute map
                .Include(x => x.ExampleEntityList)
                .ProjectTo<ExampleEntityDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

        return page;
      }
    }
  }
}

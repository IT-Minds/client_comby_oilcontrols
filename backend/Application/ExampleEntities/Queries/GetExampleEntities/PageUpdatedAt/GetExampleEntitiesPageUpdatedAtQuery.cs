using Application.Common.Interfaces;
using Application.Common.Interfaces.Pagination;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.ExampleEntities.Queries.GetExampleEntities.PageUpdatedAt
{
  public class GetExampleEntitiesPageUpdatedAtQuery : IPageRequest<ExampleEntityDto>, IPageBody<ExampleEntity, DateTimeOffset>
  {
    public int Size { get ; set ; }
    public DateTimeOffset Needle { get; set; }

    public int? Skip { get; set; }

    public DateTimeOffset GetNewNeedle(IQueryable<ExampleEntity> query)
    {
      return query.Select(x => x.LastModified).Take(Size).LastOrDefault();
    }

    public IQueryable<ExampleEntity> PreparePage(IQueryable<ExampleEntity> query)
    {
      var partial = query
            .OrderBy(x => x.LastModified)
            .Where(x => x.LastModified > Needle);
      if (Skip.HasValue)
      {
        return partial.Skip((int)(Skip * Size));
      }
      return partial;
    }

    public async Task<int> PagesRemaining(IQueryable<ExampleEntity> query)
    {
      var count = await query.CountAsync();
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)Size)) - 1;

      return pagesLeft;
    }

    public class GetExampleEntitiesQueryHandler : IPageRequestHandler<GetExampleEntitiesPageUpdatedAtQuery, ExampleEntityDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetExampleEntitiesQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<ExampleEntityDto>> Handle(GetExampleEntitiesPageUpdatedAtQuery request, CancellationToken cancellationToken)
      {

        var page = new PageResult<ExampleEntityDto>();

        var baseQuery = _context.ExampleEntities.Include(x => x.ExampleEntityList);
        var query = request.PreparePage(baseQuery);
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.Results = await query
                .Take(request.Size)
                .ProjectTo<ExampleEntityDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        page.NewNeedle = needle.UtcTicks.ToString();

        return page;
      }
    }
  }
}

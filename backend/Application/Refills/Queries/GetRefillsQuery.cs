using Application.Common.Interfaces;
using Application.Common.Interfaces.Pagination;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Refills.Queries.GetRefills.Location
{
  public class GetRefillsLocationQuery : IPageRequest<RefillDto>, IPageBody<Refill, DateTimeOffset>
  {
    public int Size { get ; set ; }
    public DateTimeOffset Needle { get; set; }

    public int? Skip { get; set; }

    public TankType TankType { get; set; }
    public int TankNumber { get; set; }

    public DateTimeOffset GetNewNeedle(IQueryable<Refill> query)
    {
      return query.Select(x => x.Created).Take(Size).LastOrDefault();
    }

    public IQueryable<Refill> PreparePage(IQueryable<Refill> query)
    {
      if (Skip.HasValue)
      {
        return query
            .OrderBy(x => x.Created)
            .Where(x => x.Created > Needle)
            .Skip((int)(Skip * Size));
      }
      return query
            .OrderBy(x => x.Created)
            .Where(x => x.Created > Needle);
    }

    public async Task<int> PagesRemaining(IQueryable<Refill> query)
    {
      var count = await query.CountAsync();
      var pagesLeft = (int)(Math.Floor((float)count / (float)Size)) - 1;

      return pagesLeft;
    }

    public class GetRefillsQueryHandler : IPageRequestHandler<GetRefillsLocationQuery, RefillDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetRefillsQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<RefillDto>> Handle(GetRefillsLocationQuery request, CancellationToken cancellationToken)
      {

        var page = new PageResult<RefillDto>();

        var baseQuery = _context.Refills;
        var query = request.PreparePage(baseQuery);
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.Results = await query
                .Where(x => x.Location.Type == request.TankType && x.Location.TankNumber == request.TankNumber)
                .Take(request.Size)
                .ProjectTo<RefillDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        page.NewNeedle = needle;

        return page;
      }
    }
  }
}

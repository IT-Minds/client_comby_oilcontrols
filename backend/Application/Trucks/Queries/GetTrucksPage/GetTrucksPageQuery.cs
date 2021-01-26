using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Pagination;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Trucks.Queries.GetTrucksPage
{
  public class GetTrucksPageQuery : IPageRequest<TruckInfoIdDto, int>, IPageBody<Truck, int>
  {
    public int Size { get; set; }
    public int? Skip { get; set; }
    public int Needle { get; set; }

    public int GetNewNeedle(IQueryable<Truck> query)
    {
      return query.Select(x => x.Id).Take(Size).LastOrDefault();
    }

    public async Task<int> PagesRemaining(IQueryable<Truck> query)
    {
      var count = await query.CountAsync();
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)Size)) - 1;

      return pagesLeft;
    }

    public IQueryable<Truck> PreparePage(IQueryable<Truck> query)
    {
      var partial = query
        .OrderBy(x => x.LastModified)
        .Where(x => x.Id > Needle);

      if (Skip.HasValue)
      {
        return partial.Skip((int)(Skip * Size));
      }
      return partial;
    }

    public class GetTrucksPageQueryHandler : IPageRequestHandler<GetTrucksPageQuery, TruckInfoIdDto, int>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetTrucksPageQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<TruckInfoIdDto, int>> Handle(GetTrucksPageQuery request, CancellationToken cancellationToken)
      {
        var page = new PageResult<TruckInfoIdDto, int>();

        var baseQuery = _context.Trucks
          .Include(x => x.DailyStates)
          .Include(x => x.Route)
          .ThenInclude(x => x.Refills);
        var query = request.PreparePage(baseQuery);
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.Results = await query
          .Take(request.Size)
          .ProjectTo<TruckInfoIdDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);
        page.NewNeedle = needle;

        return page;
      }
    }
  }
}

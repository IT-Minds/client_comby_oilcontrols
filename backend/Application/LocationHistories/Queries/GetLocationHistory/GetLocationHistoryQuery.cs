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

namespace Application.LocationHistories.Queries.GetAllLocationHistories
{
  public class GetLocationHistoryQuery : IPageRequest<LocationHistoryDto>, IPageBody<LocationHistory, DateTime>
  {
    public int LocationId { get; set; }
    public int Size { get; set; }
    public int? Skip { get; set; }
    public DateTime Needle { get; set; }

    public DateTime GetNewNeedle(IQueryable<LocationHistory> query)
    {
      return query.Select(x => x.LastModified).Take(Size).LastOrDefault().DateTime;
    }

    public async Task<int> PagesRemaining(IQueryable<LocationHistory> query)
    {
      var count = await query.CountAsync();
      var pagesLeft = Math.Clamp((int)(Math.Floor((float)count / (float)Size)) - 1, 0, int.MaxValue);

      return pagesLeft;
    }

    public IQueryable<LocationHistory> PreparePage(IQueryable<LocationHistory> query)
    {
      var partial = query
        .Where(x => x.LocationId == LocationId)
        .OrderByDescending(x => x.Created)
        .Where(x => x.Created.DateTime.CompareTo(Needle) > 0);

      if (Skip.HasValue)
      {
        return partial.Skip((int)(Skip * Size));
      }
      return partial;
    }

    public class GetLocationHistoryQueryHandler : IPageRequestHandler<GetLocationHistoryQuery, LocationHistoryDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetLocationHistoryQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<LocationHistoryDto>> Handle(GetLocationHistoryQuery request, CancellationToken cancellationToken)
      {
        var page = new PageResult<LocationHistoryDto>();

        var baseQuery = _context.LocationHistories;
        var query = request.PreparePage(baseQuery);
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.Results = await query
          .Take(request.Size)
          .ProjectTo<LocationHistoryDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);
        page.NewNeedle = needle.ToString();

        return page;
      }
    }
  }
}

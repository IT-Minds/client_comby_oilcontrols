using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Pagination;
using Application.Common.Security;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.Queries.GetDebtorHistory
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_DEBTOR, Domain.Enums.Action.GET_LOCATION)]
  public class GetDebtorHistoryQuery : IPageRequest<LocationDebtorHistoryDto, DateTime>, IPageBody<LocationDebtorHistory, DateTime>
  {
    public int LocationId { get; set; }
    public int Size { get; set; }
    public int? Skip { get; set; }
    public DateTime Needle { get; set; }

    public DateTime GetNewNeedle(IQueryable<LocationDebtorHistory> query)
    {
      return query.Select(x => x.LastModified).Take(Size).LastOrDefault().DateTime;
    }

    public async Task<int> PagesRemaining(IQueryable<LocationDebtorHistory> query)
    {
      var count = await query.CountAsync();
      if (count == 0) return 0;
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)Size)) - 1;

      return pagesLeft;
    }

    public IQueryable<LocationDebtorHistory> PreparePage(IQueryable<LocationDebtorHistory> query)
    {
      var partial = query
        .Where(x => x.LocationId == LocationId)
        .OrderByDescending(x => x.Created)
        .Where(x => x.Created < Needle);

      if (Skip.HasValue)
      {
        return partial.Skip((int)(Skip * Size));
      }
      return partial;
    }

    public class GetDebtorHistoryQueryHandler : IPageRequestHandler<GetDebtorHistoryQuery, LocationDebtorHistoryDto, DateTime>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetDebtorHistoryQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<LocationDebtorHistoryDto, DateTime>> Handle(GetDebtorHistoryQuery request, CancellationToken cancellationToken)
      {
        var page = new PageResult<LocationDebtorHistoryDto, DateTime>();

        var baseQuery = _context.LocationDebtorHistories;
        var query = request.PreparePage(baseQuery);
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.Results = await query
          .Take(request.Size)
          .ProjectTo<LocationDebtorHistoryDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);
        page.NewNeedle = needle;

        return page;
      }
    }
  }
}
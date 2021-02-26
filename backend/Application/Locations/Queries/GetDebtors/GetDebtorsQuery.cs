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
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Application.Locations.Queries.GetDebtors
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_DEBTOR)]
  public class GetDebtorsQuery : IPageRequest<LocationDetailsIdDto, DateTimeOffset>, IPageBody<Location, DateTimeOffset>
  {
    public TankType? TankType { get; set; }

    public int Size { get; set; }
    public int? Skip { get; set; }
    public DateTimeOffset Needle { get; set; }

    public DateTimeOffset GetNewNeedle(IQueryable<Location> query)
    {
      return query.Select(x => x.LastModified).Take(Size).LastOrDefault();
    }

    public async Task<int> PagesRemaining(IQueryable<Location> query)
    {
      var count = await query.CountAsync();
      if (count == 0) return 0;
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)Size)) - 1;

      return pagesLeft;
    }

    public IQueryable<Location> PreparePage(IQueryable<Location> query)
    {
      var partial = query
        .OrderByDescending(x => x.Created)
        .Where(x => x.InactiveSince >= DateTime.Now && x.Created < Needle);

      if (TankType.HasValue)
      {
        partial = partial
          .Include(x => x.FuelTank)
          .Where(x => x.TankType == TankType);
      }

      if (Skip.HasValue)
      {
        return partial.Skip((int)(Skip * Size));
      }
      return partial;
    }

    public class GetDebtorsQueryHandler : IPageRequestHandler<GetDebtorsQuery, LocationDetailsIdDto, DateTimeOffset>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetDebtorsQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<LocationDetailsIdDto, DateTimeOffset>> Handle(GetDebtorsQuery request, CancellationToken cancellationToken)
      {
        var page = new PageResult<LocationDetailsIdDto, DateTimeOffset>();

        var query = request.PreparePage(_context.Locations.Include(x => x.FuelTank));
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.Results = await query
          .Take(request.Size)
          .ProjectTo<LocationDetailsIdDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);
        page.NewNeedle = needle;

        return page;
      }
    }
  }
}

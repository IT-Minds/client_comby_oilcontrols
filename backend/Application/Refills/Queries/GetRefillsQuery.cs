using Application.Common.Interfaces;
using Application.Common.Interfaces.Pagination;
using Application.Common.Security;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Domain.Entities.Refills;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Refills.Queries.GetRefills.Location
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_REFILLS)]
  public class GetRefillsLocationQuery : IPageRequest<RefillDto>, IPageBody<CompletedRefill, DateTimeOffset>
  {
    public int Size { get; set; }
    public DateTimeOffset Needle { get; set; }
    public int? Skip { get; set; }

    public TankType? TankType { get; set; }

    public DateTimeOffset GetNewNeedle(IQueryable<CompletedRefill> query)
    {
      return query.Select(x => x.Created).Take(Size).LastOrDefault();
    }

    public IQueryable<CompletedRefill> PreparePage(IQueryable<CompletedRefill> query)
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

    public async Task<int> PagesRemaining(IQueryable<CompletedRefill> query)
    {
      var count = await query.CountAsync();
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)Size)) - 1;

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

        IQueryable<CompletedRefill> baseQuery = _context.CompletedRefills.AsQueryable()
         .Include(refill => refill.Coupon)
         .Include(refill => refill.Location)
            .ThenInclude(location => location.FuelTank);

        if (request.TankType.HasValue)
        {
          baseQuery = baseQuery.Where(refill => refill.Location.FuelTank.TankType == request.TankType);
        }
        var query = request.PreparePage(baseQuery);
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.Results = await query
                .Take(request.Size)
                .ProjectTo<RefillDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        page.NewNeedle = needle + "";

        return page;
      }
    }
  }
}

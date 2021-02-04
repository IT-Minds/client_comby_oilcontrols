using Application.Common.Interfaces;
using Application.Common.Interfaces.Pagination;
using Application.Common.Security;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Coupons.Queries.GetCoupons.Truck
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_COUPONS)]
  public class GetCouponsTruckQuery : IPageRequest<CouponIdDto, DateTimeOffset>, IPageBody<Coupon, DateTimeOffset>
  {
    public int Size { get; set; }
    public DateTimeOffset Needle { get; set; }
    public int? Skip { get; set; }
    public int TruckId { get; set; }

    public DateTimeOffset GetNewNeedle(IQueryable<Coupon> query)
    {
      return query.Select(x => x.Created).Take(Size).LastOrDefault();
    }

    public IQueryable<Coupon> PreparePage(IQueryable<Coupon> query)
    {
      if (Skip.HasValue)
      {
        return query
            .OrderByDescending(x => x.LastModified)
            .Where(x => x.LastModified < Needle)
            .Skip((int)(Skip * Size));
      }
      return query
            .OrderBy(x => x.Created)
            .Where(x => x.Created > Needle);
    }

    public async Task<int> PagesRemaining(IQueryable<Coupon> query)
    {
      var count = await query.CountAsync();
      if (count == 0) return 0;
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)Size)) - 1;

      return pagesLeft;
    }

    public class GetCouponsTruckQueryHandler : IPageRequestHandler<GetCouponsTruckQuery, CouponIdDto, DateTimeOffset>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetCouponsTruckQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<CouponIdDto, DateTimeOffset>> Handle(GetCouponsTruckQuery request, CancellationToken cancellationToken)
      {

        var page = new PageResult<CouponIdDto, DateTimeOffset>();

        var baseQuery = _context.Coupons
          .Where(x => x.TruckId == request.TruckId);

        var query = request.PreparePage(baseQuery);
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.Results = await query
                .Take(request.Size)
                .ProjectTo<CouponIdDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        page.NewNeedle = needle;

        return page;
      }
    }
  }
}

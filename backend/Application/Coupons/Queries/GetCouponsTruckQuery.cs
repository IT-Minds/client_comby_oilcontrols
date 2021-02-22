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
  public class GetCouponsTruckQuery : IPageRequest<CouponIdDto, int>, IPageBody<Coupon, int>
  {
    public int Size { get; set; }
    public int Needle { get; set; } //coupon number
    public int? Skip { get; set; }
    public int TruckId { get; set; }

    public int GetNewNeedle(IQueryable<Coupon> query)
    {
      return query.Select(x => x.CouponNumber).Take(Size).LastOrDefault();
    }

    public IQueryable<Coupon> PreparePage(IQueryable<Coupon> query)
    {
      if (Skip.HasValue)
      {
        return query
            .OrderBy(x => x.CouponNumber)
            .Where(x => x.CouponNumber > Needle)
            .Skip((int)(Skip * Size));
      }
      return query
            .OrderBy(x => x.CouponNumber)
            .Where(x => x.CouponNumber > Needle);
    }

    public async Task<int> PagesRemaining(IQueryable<Coupon> query)
    {
      var count = await query.CountAsync();
      if (count == 0) return 0;
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)Size)) - 1;

      return pagesLeft;
    }

    public class GetCouponsTruckQueryHandler : IPageRequestHandler<GetCouponsTruckQuery, CouponIdDto, int>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetCouponsTruckQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<CouponIdDto, int>> Handle(GetCouponsTruckQuery request, CancellationToken cancellationToken)
      {

        var page = new PageResult<CouponIdDto, int>();

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

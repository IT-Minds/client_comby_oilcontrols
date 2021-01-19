
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

namespace Application.Streets.Queries.GetStreets
{
  public class GetStreetsQuery : IPageRequest<StreetDto>, IPageBody<Street, string>
  {
    public int Size { get; set; }
    public int? Skip { get; set; }
    public string Needle { get; set; }

    public string GetNewNeedle(IQueryable<Street> query)
    {
      return query.Select(x => x.Name).Take(Size).LastOrDefault();
    }

    public async Task<int> PagesRemaining(IQueryable<Street> query)
    {
      var count = await query.CountAsync();
      var pagesLeft = Math.Max((int)(Math.Floor((float)count / (float)Size)) - 1, 0);

      return pagesLeft;
    }

    public IQueryable<Street> PreparePage(IQueryable<Street> query)
    {
      if (Skip.HasValue)
      {
        return query
            .OrderBy(x => x.Name)
            .Where(x => String.Compare(x.Name, Needle) > 0)
            .Skip((int)(Skip * Size));
      }
      return query
            .OrderBy(x => x.Name)
            .Where(x => String.Compare(x.Name, Needle) > 0);
    }

    public class GetStreetsQueryHandler : IPageRequestHandler<GetStreetsQuery, StreetDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetStreetsQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<StreetDto>> Handle(GetStreetsQuery request, CancellationToken cancellationToken)
      {
        var page = new PageResult<StreetDto>();

        var baseQuery = _context.Streets.Include(x => x.Region);
        var query = request.PreparePage(baseQuery);
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.Results = await query
                .Take(request.Size)
                .ProjectTo<StreetDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        page.NewNeedle = needle;

        return page;
      }
    }

  }

}
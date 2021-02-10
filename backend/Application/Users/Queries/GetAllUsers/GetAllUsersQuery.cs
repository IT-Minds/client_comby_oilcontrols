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

namespace Application.Users.Queries.GetAllUsers
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_ALL_USERS)]
  public class GetAllUsersQuery: IPageRequest<UserDto, int>, IPageBody<User, int>
  {
    public int Size { get; set; }
    public int? Skip { get; set; }
    public int Needle { get; set; }

    public int GetNewNeedle(IQueryable<User> query)
    {
      return query.Select(x => x.Id).Take(Size).LastOrDefault();
    }

    public async Task<int> PagesRemaining(IQueryable<User> query)
    {
      var count = await query.CountAsync();
      if(count == 0) return 0;
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)Size)) - 1;

      return pagesLeft;
    }

    public IQueryable<User> PreparePage(IQueryable<User> query)
    {
      var partial = query
        .OrderBy(x => x.Id)
        .Where(x => x.Id > Needle);

      if (Skip.HasValue)
      {
        return partial.Skip((int)(Skip * Size));
      }
      return partial;
    }

    public class GetAllUsersQueryHandler : IPageRequestHandler<GetAllUsersQuery, UserDto, int>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetAllUsersQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<UserDto, int>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
      {
        var page = new PageResult<UserDto, int>();

        var query = request.PreparePage(_context.Users
          .Include(u => u.Roles)
            .ThenInclude(r => r.Role)
              .ThenInclude(r => r.Actions)
        );

        page.Results = await query
          .Take(request.Size)
          .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
          .ToListAsync(cancellationToken);

        var pagesRemaining = await request.PagesRemaining(query);
        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;
        page.NewNeedle = request.GetNewNeedle(query);

        return page;
      }
    }
  }
}

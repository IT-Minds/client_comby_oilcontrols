using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Pagination;
using Application.Common.Security;
using AutoMapper;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Roles.Queries.GetAllRoles
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_ROLES)]
  public class GetAllRolesQuery : IPageRequest<RoleDto>, IPageBody<Role, string>
  {
    public int Size { get; set; }
    public int? Skip { get; set; }
    public string Needle { get; set; }

    public string GetNewNeedle(IQueryable<Role> query)
    {
      return query.Select(x => x.Name).Take(Size).LastOrDefault();
    }

    public async Task<int> PagesRemaining(IQueryable<Role> query)
    {
      var count = await query.CountAsync();
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)Size)) - 1;

      return pagesLeft;
    }

    public System.Linq.IQueryable<Role> PreparePage(IQueryable<Role> query)
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

    public class GetAllRolesQueryHandler : IPageRequestHandler<GetAllRolesQuery, RoleDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public GetAllRolesQueryHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<PageResult<RoleDto>> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
      {
        var page = new PageResult<RoleDto>();

        var baseQuery = _context.Roles.Include(x => x.Actions);
        var query = request.PreparePage(baseQuery);
        var pagesRemaining = await request.PagesRemaining(query);
        var needle = request.GetNewNeedle(query);

        page.HasMore = pagesRemaining > 0;
        page.PagesRemaining = pagesRemaining;

        var queryResult = await query.Take(request.Size).ToListAsync(cancellationToken);
        var pageResult = new List<RoleDto>();
        foreach (var role in queryResult)
        {
          pageResult.Add(new RoleDto
          {
            Name = role.Name,
            Actions = role.Actions.Select(act => act.Action).ToList()
          });
        }

        page.Results = pageResult;
        page.NewNeedle = needle;

        return page;
      }
    }
  }
}
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces.Pagination;
using Application.Roles;
using Application.Roles.Queries.GetAllRoles;
using AutoMapper;
using FluentAssertions;
using Infrastructure.Persistence;
using Xunit;

namespace Application.UnitTests.Roles.Queryies.GetAllRoles
{
  [Collection("QueryTests")]
  public class GetAllRolesQueryTest
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAllRolesQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_ReturnsCorrectPageAndEntitiesCount()
    {
      var query = new GetAllRolesQuery
      {
        Size = 500,
        Skip = 0,
        Needle = "a"
      };
      var numEntities = _context.Roles.Count();

      var handler = new GetAllRolesQuery.GetAllRolesQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<RoleDto>>();
      result.Results.Count.Should().Be(numEntities);
    }

    [Fact]
    public async Task Handle_EnsureCorrectPagination()
    {
      var query = new GetAllRolesQuery
      {
        Size = 2,
        Skip = 0,
        Needle = "a"
      };

      var handler = new GetAllRolesQuery.GetAllRolesQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<RoleDto>>();
      result.Results.Count.Should().Be(2);
      result.PagesRemaining.Should().Be(2);
    }
  }
}
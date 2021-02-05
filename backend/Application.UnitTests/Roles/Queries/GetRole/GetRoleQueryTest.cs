using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Roles.Queries.GetRole;
using AutoMapper;
using FluentAssertions;
using Infrastructure.Persistence;
using Xunit;

namespace Application.UnitTests.Roles.Queryies.GetRole
{
  [Collection("QueryTests")]
  public class GetRoleQueryTest
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRoleQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_GetRole()
    {
      var query = new GetRoleQuery
      {
        Id = 200
      };
      var handler = new GetRoleQuery.GetRoleQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);

      result.Should().NotBeNull();
    }


    [Fact]
    public async Task Handle_NoSuchRole()
    {
      var query = new GetRoleQuery
      {
        Id = -200
      };
      var handler = new GetRoleQuery.GetRoleQueryHandler(_context, _mapper);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(query, CancellationToken.None); }
      );
    }
  }
}
using Application.Common.Interfaces.Pagination;
using Application.Refills;
using Application.Refills.Queries.GetRefills;
using Application.Refills.Queries.GetRefills.Location;
using AutoMapper;
using Domain.Enums;
using FluentAssertions;
using Infrastructure.Persistence;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.Refills.Queries.GetRefills
{
  [Collection("QueryTests")]
  public class GetRefillsQueryTest
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRefillsQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact(Skip = "TODO: Nullable object must have a value.")]
    public async Task Handle_ReturnsCorrectPageAndEntitiesCount()
    {
      var query = new GetRefillsLocationQuery
      {
        Size = 500,
        Needle = new System.DateTimeOffset(new System.DateTime(2019, 12, 31)),
        TankType = TankType.BUILDING
      };
      var handler = new GetRefillsLocationQuery.GetRefillsQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<RefillDto>>();
      result.Results.Count.Should().Be(6);
    }

    [Fact(Skip = "TODO: Nullable object must have a value.")]
    public async Task Handle_NonexistentLocationId()
    {
      var query = new GetRefillsLocationQuery
      {
        Size = 500,
        Needle = new System.DateTimeOffset(new System.DateTime(2069, 1, 1)),
        TankType = TankType.BUILDING
      };
      var handler = new GetRefillsLocationQuery.GetRefillsQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<RefillDto>>();
      result.Results.Count.Should().Be(0);
    }
  }
}

using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces.Pagination;
using Application.LocationHistories.Queries;
using Application.LocationHistories.Queries.GetAllLocationHistories;
using AutoMapper;
using FluentAssertions;
using Infrastructure.Persistence;
using Xunit;

namespace Application.UnitTests.LocationHistories.GetLocationHistory
{
  [Collection("QueryTests")]
  public class GetLocationHistoryQueryTest
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetLocationHistoryQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_ReturnsCorrectPageAndEntitiesCount()
    {
      var query = new GetLocationHistoryQuery
      {
        LocationId = 1,
        Size = 500,
        Needle = new DateTime(1, 1, 1),
        Skip = 0
      };
      var handler = new GetLocationHistoryQuery.GetLocationHistoryQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationHistoryDto>>();
      result.Results.Count.Should().Be(3);
      result.PagesRemaining.Should().Be(0);
    }

    [Fact]
    public async Task Handle_NonExistentLocationHistories()
    {
      var query = new GetLocationHistoryQuery
      {
        LocationId = -1,
        Size = 500,
        Needle = new DateTime(1, 1, 1),
        Skip = 0
      };
      var handler = new GetLocationHistoryQuery.GetLocationHistoryQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationHistoryDto>>();
      result.Results.Count.Should().Be(0);
      result.PagesRemaining.Should().Be(0);
    }

    [Fact]
    public async Task Handle_NoNeedle()
    {
      var query = new GetLocationHistoryQuery
      {
        LocationId = -1,
        Size = 500,
        Skip = 0
      };
      var handler = new GetLocationHistoryQuery.GetLocationHistoryQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationHistoryDto>>();
      result.Results.Count.Should().Be(0);
      result.PagesRemaining.Should().Be(0);
    }
  }
}

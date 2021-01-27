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

namespace Application.UnitTests.LocationHistories.GetAllLocationsHistories
{
  [Collection("QueryTests")]
  public class GetAllLocationHistoriesQueryTest
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAllLocationHistoriesQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_ReturnsCorrectPageAndEntitiesCount()
    {
      var query = new GetAllLocationHistoriesQuery
      {
        Size = 500,
        Needle = 0,
        Skip = 0
      };
      var handler = new GetAllLocationHistoriesQuery.GetAllLocationHistoriesQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationHistoryDto>>();
      result.Results.Count.Should().Be(3);
      result.PagesRemaining.Should().Be(0);
    }

    [Fact]
    public async Task Handle_NonZeroNeedle()
    {
      var query = new GetAllLocationHistoriesQuery
      {
        Size = 500,
        Needle = 1,
        Skip = 0
      };
      var handler = new GetAllLocationHistoriesQuery.GetAllLocationHistoriesQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationHistoryDto>>();
      result.Results.Count.Should().Be(0);
      result.PagesRemaining.Should().Be(0);
    }

    [Fact]
    public async Task Handle_SkipTwoEntries()
    {
      var query = new GetAllLocationHistoriesQuery
      {
        Size = 1,
        Needle = 0,
        Skip = 2
      };
      var handler = new GetAllLocationHistoriesQuery.GetAllLocationHistoriesQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationHistoryDto>>();
      result.Results.Count.Should().Be(1);
      result.PagesRemaining.Should().Be(0);
    }

    [Fact]
    public async Task Handle_SkipEverything()
    {
      var query = new GetAllLocationHistoriesQuery
      {
        Size = 3,
        Needle = 0,
        Skip = 2
      };
      var handler = new GetAllLocationHistoriesQuery.GetAllLocationHistoriesQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationHistoryDto>>();
      result.Results.Count.Should().Be(0);
      result.PagesRemaining.Should().Be(0);
    }

    [Fact]
    public async Task Handle_PageSize1Skip0()
    {
      var query = new GetAllLocationHistoriesQuery
      {
        Size = 1,
        Needle = 0,
        Skip = 0
      };
      var handler = new GetAllLocationHistoriesQuery.GetAllLocationHistoriesQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationHistoryDto>>();
      result.Results.Count.Should().Be(1);
      result.PagesRemaining.Should().Be(2);
    }
  }
}
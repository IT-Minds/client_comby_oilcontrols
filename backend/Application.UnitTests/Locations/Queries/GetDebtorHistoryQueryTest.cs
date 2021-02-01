using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces.Pagination;
using Application.Locations.Queries.GetDebtorHistory;
using AutoMapper;
using FluentAssertions;
using Infrastructure.Persistence;
using Xunit;

namespace Application.UnitTests.Locations.Queries
{
  [Collection("QueryTests")]
  public class GetDebtorHistoryQueryTest
  {

    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetDebtorHistoryQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }


    [Fact]
    public async Task Handle_GetDebtorHistory()
    {
      var query = new GetDebtorHistoryQuery
      {
        LocationId = 500,
        Size = 500,
        Needle = new DateTime(3000, 1, 1),
        Skip = 0
      };

      var handler = new GetDebtorHistoryQuery.GetDebtorHistoryQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationDebtorHistoryDto, DateTime>>();
      result.Results.Count.Should().Be(2);
      result.PagesRemaining.Should().Be(0);
    }

    [Fact]
    public async Task Handle_NonExistentLocation()
    {
      var query = new GetDebtorHistoryQuery
      {
        LocationId = -500,
        Size = 500,
        Needle = new DateTime(3000, 1, 1),
        Skip = 0
      };

      var handler = new GetDebtorHistoryQuery.GetDebtorHistoryQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<LocationDebtorHistoryDto, DateTime>>();
      result.Results.Count.Should().Be(0);
      result.PagesRemaining.Should().Be(0);
    }
  }
}

using Application.Common.Interfaces.Pagination;
using Application.Trucks;
using Application.Trucks.Queries.GetTrucksPage;
using AutoMapper;
using FluentAssertions;
using Infrastructure.Persistence;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.Trucks.Queries.GetTRucksPage
{
  [Collection("QueryTests")]
  public class GetTrucksPageQueryTest : CommandTestBase
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTrucksPageQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_ReturnsCorrectPageAndEntitiesCount()
    {
      var query = new GetTrucksPageQuery
      {
        Size = 500,
        Needle = 0,
        Skip = 0
      };
      var numTruck = _context.Trucks.Count();
      var handler = new GetTrucksPageQuery.GetTrucksPageQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<TruckInfoIdDto, int>>();
      result.Results.Count.Should().Be(numTruck);
    }

    [Fact]
    public async Task Handle_EnsureCorrectPagination()
    {
      var query = new GetTrucksPageQuery
      {
        Size = 1,
        Skip = 0,
        Needle = 0
      };
      var count = Context.Trucks.Count();
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)query.Size)) - 1;

      var handler = new GetTrucksPageQuery.GetTrucksPageQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<TruckInfoIdDto, int>>();
      result.Results.Count.Should().Be(query.Size);
      result.PagesRemaining.Should().Be(pagesLeft);
      result.Results[0].Id.Should().Be(43);
      result.Results[0].TruckIdentifier.Should().Be("Truck1");
    }

    [Fact]
    public async Task Handle_EnsureMoreCorrectPagination()
    {
      var query = new GetTrucksPageQuery
      {
        Size = 1,
        Skip = 2,
        Needle = 0
      };
      var count = Context.Trucks.Skip((int)(query.Skip * query.Size)).Count();
      var pagesLeft = (int)(Math.Ceiling((float)count / (float)query.Size)) - 1;

      var handler = new GetTrucksPageQuery.GetTrucksPageQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<TruckInfoIdDto, int>>();
      result.Results.Count.Should().Be(query.Size);
      result.PagesRemaining.Should().Be(pagesLeft);
      result.Results[0].Id.Should().Be(100);
      result.Results[0].TruckIdentifier.Should().Be("Truck3");
    }

    [Fact(Skip = "Not sure what the desired outcome is when a request with Size = 0 is made.")]
    public async Task Handle_PageSizeZero()
    {
      var query = new GetTrucksPageQuery
      {
        Size = 0,
        Skip = 0,
        Needle = 0
      };
      var handler = new GetTrucksPageQuery.GetTrucksPageQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<TruckInfoIdDto, int>>();
      result.Results.Count.Should().Be(0);
      result.PagesRemaining.Should().Be(int.MaxValue);
    }
  }
}

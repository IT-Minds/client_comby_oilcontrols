using FluentAssertions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Infrastructure.Persistence;
using AutoMapper;
using Application.Streets.Queries.GetStreets;
using Application.Common.Interfaces.Pagination;

namespace Application.UnitTests.Streets.Queries.GetStreets
{
  [Collection("QueryTests")]
  public class GetStreetsQueryTest : CommandTestBase
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetStreetsQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_ReturnsCorrectPageAndEntitiesCount()
    {
      var query = new GetStreetsQuery
      {
        Size = 500,
        Skip = 0,
        Needle = "a"
      };

      var handler = new GetStreetsQuery.GetStreetsQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<StreetDto>>();
      result.Results.Count.Should().Be(9);
    }

    [Fact]
    public async Task Handle_EnsureCorrectPagination()
    {
      var query = new GetStreetsQuery
      {
        Size = 3,
        Skip = 0,
        Needle = "a"
      };

      var handler = new GetStreetsQuery.GetStreetsQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<StreetDto>>();
      result.Results.Count.Should().Be(3);
      result.PagesRemaining.Should().Be(2);
      result.Results[0].Name.Should().Be("A_Street");
      result.Results[0].RegionId.Should().Be(1);
      result.Results[1].Name.Should().Be("Aa_Street");
      result.Results[1].RegionId.Should().Be(1);
      result.Results[2].Name.Should().Be("Aaa_Street");
      result.Results[2].RegionId.Should().Be(1);
    }

    [Fact]
    public async Task Handle_EnsureMoreCorrectPagination()
    {
      var query = new GetStreetsQuery
      {
        Size = 8,
        Skip = 1,
        Needle = "a"
      };

      var handler = new GetStreetsQuery.GetStreetsQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<StreetDto>>();
      result.Results.Count.Should().Be(1);
      result.PagesRemaining.Should().Be(0);
      result.Results[0].Name.Should().Be("st_Street");
      result.Results[0].RegionId.Should().Be(5);
    }

    [Fact(Skip = "Not sure what the desired outcome is when a request with Size = 0 is made.")]
    public async Task Handle_PageSizeZero()
    {
      var query = new GetStreetsQuery
      {
        Size = 0,
        Skip = 0,
        Needle = "a"
      };

      var handler = new GetStreetsQuery.GetStreetsQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<StreetDto>>();
      result.Results.Count.Should().Be(0);
      result.PagesRemaining.Should().Be(int.MaxValue);
    }
  }
}

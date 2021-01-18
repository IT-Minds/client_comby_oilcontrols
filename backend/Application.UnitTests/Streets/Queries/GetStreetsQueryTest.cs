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
  }
}

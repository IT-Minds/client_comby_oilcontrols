using Application.ExampleEntities.Queries.GetExampleEntities;
using AutoMapper;
using FluentAssertions;
using Infrastructure.Persistence;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.ExampleEntities.Queries.GetExampleEntities
{
  [Collection("QueryTests")]
  public class GetExampleEntitiesQueryTest
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetExampleEntitiesQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_ReturnsCorrectVmAndExampleEntitiesCount()
    {
      var query = new GetExampleEntitiesQuery();

      var handler = new GetExampleEntitiesQuery.GetExampleEntitiesQueryHandler(_context, _mapper);

      var result = await handler.Handle(query, CancellationToken.None);

      result.Should().BeOfType<ExampleEntitiesViewModel>();
      result.ExampleEntities.Count.Should().Be(5);
    }
  }
}

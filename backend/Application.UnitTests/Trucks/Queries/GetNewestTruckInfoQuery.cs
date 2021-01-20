using System.Threading;
using System.Threading.Tasks;
using Application.Trucks.Queries.GetTruckInfo;
using AutoMapper;
using FluentAssertions;
using Infrastructure.Persistence;
using Xunit;

namespace Application.UnitTests.Trucks.Queries.GetNewestTruckInfo
{
  [Collection("QueryTests")]
  public class GetNewestTruckInfoQueryTest
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetNewestTruckInfoQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_ReturnsCorrectTruck()
    {
      var query = new GetNewestTruckInfoQuery
      {
        TruckId = 43
      };

      var handler = new GetNewestTruckInfoQuery.GetNewestTruckInfoQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);

      result.Id.Should().Be(43);
    }
  }
}
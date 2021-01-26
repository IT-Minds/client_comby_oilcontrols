using System.Threading;
using System.Threading.Tasks;
using Application.Locations.Queries;
using AutoMapper;
using Domain.Enums;
using FluentAssertions;
using Infrastructure.Persistence;
using Xunit;

namespace Application.UnitTests.Locations.Queries
{
  [Collection("QueryTests")]
  public class GetLocationsRequeringRefillsTest
  {

    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetLocationsRequeringRefillsTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }


    [Fact]
    public async Task Handle_Something()
    {
      var query = new GetLocationRequiringRefill
      {
        TruckId = 100
      };

      var handler = new GetLocationRequiringRefill.GetLocationRequiringRefillHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);

      result.Should().NotBeEmpty();
    }
  }
}

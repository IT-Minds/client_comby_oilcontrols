using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Trucks.Queries.GetTruckInfo;
using AutoMapper;
using Domain.Enums;
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
      var query = new GetTruckInfoQuery
      {
        Id = 43
      };

      var handler = new GetTruckInfoQuery.GetTruckInfoQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);

      result.Id.Should().Be(43);
    }

    [Fact]
    public async Task Handle_InvalidTruckId()
    {
      var query = new GetTruckInfoQuery
      {
        Id = -1
      };

      var handler = new GetTruckInfoQuery.GetTruckInfoQueryHandler(_context, _mapper);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { var result = await handler.Handle(query, CancellationToken.None); }
      );
    }
  }
}

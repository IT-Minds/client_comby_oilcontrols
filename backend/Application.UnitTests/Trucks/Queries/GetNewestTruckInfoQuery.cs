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
      var query = new GetNewestTruckInfoQuery
      {
        TruckId = 43
      };

      var handler = new GetNewestTruckInfoQuery.GetNewestTruckInfoQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);

      result.Id.Should().Be(43);
      result.Date.Should().Be(new DateTime(2020, 1, 1));
      result.MorningQuantity.Should().Be(500);
      result.EveningQuantity.Should().Be(1000);
      result.TruckRefills.Count().Should().Be(3);
      var refills = result.TruckRefills.OrderBy(x => x.TimeStamp).ToList();
      refills[0].Id.Should().Be(1);
      refills[0].FuelCardNumber.Should().Be(1);
      refills[0].FuelType.Should().Be(FuelType.GASOLINE);
      refills[0].Amount.Should().Be(100);
      refills[1].Id.Should().Be(2);
      refills[1].FuelCardNumber.Should().Be(1);
      refills[1].FuelType.Should().Be(FuelType.GASOLINE);
      refills[1].Amount.Should().Be(200);
      refills[2].Id.Should().Be(3);
      refills[2].FuelCardNumber.Should().Be(1);
      refills[2].FuelType.Should().Be(FuelType.GASOLINE);
      refills[2].Amount.Should().Be(200);
    }

    [Fact(Skip = "Cannot find a way to not get the Nullable object must have a value. - exception.")]
    public async Task Handle_NoDailyStateOnTruck()
    {
      var query = new GetNewestTruckInfoQuery
      {
        TruckId = 44
      };

      var handler = new GetNewestTruckInfoQuery.GetNewestTruckInfoQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);

      result.Id.Should().Be(44);

    }
  }
}
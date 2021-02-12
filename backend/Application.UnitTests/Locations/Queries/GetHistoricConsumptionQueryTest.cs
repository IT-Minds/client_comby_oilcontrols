using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces.Pagination;
using Application.Locations.Queries.GetDebtorHistory;
using Application.Locations.Queries.GetHistoricConsumption;
using AutoMapper;
using FluentAssertions;
using Infrastructure.Persistence;
using Xunit;

namespace Application.UnitTests.Locations.Queries
{
  [Collection("QueryTests")]
  public class GetHistoricConsumptionQueryTest
  {

    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetHistoricConsumptionQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }


    [Fact]
    public async Task Handle_CalculateSimpleHistoricConsumption()
    {
      var query = new GetHistoricConsumptionQuery
      {
        Dto = new HistoricConsumptionDto
        {
          LocationId = 600,
          StartDate = new DateTime(2021, 1, 1),
          EndDate = new DateTime(2021, 2, 1),
          Interval = Domain.Enums.Interval.WEEK
        }
      };

      var handler = new GetHistoricConsumptionQuery.GetHistoricConsumptionQueryHandler(_context);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().NotBeEmpty();
    }

    [Fact]
    public async Task Handle_CalculateMoreHistoricConsumptions()
    {
      var query = new GetHistoricConsumptionQuery
      {
        Dto = new HistoricConsumptionDto
        {
          LocationId = 600,
          StartDate = new DateTime(2020, 12, 1),
          EndDate = new DateTime(2021, 1, 2),
          Interval = Domain.Enums.Interval.WEEK
        }
      };

      var handler = new GetHistoricConsumptionQuery.GetHistoricConsumptionQueryHandler(_context);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().NotBeEmpty();
      result.Count().Should().Be(5);
      Math.Round(result[2].FuelConsumed, 2).Should().Be(150.0);
      Math.Round(result[3].FuelConsumed, 2).Should().Be(525.0);
      Math.Round(result[4].FuelConsumed, 2).Should().Be(281.25);
    }

    [Fact]
    public async Task Handle_NotEnoughRefills()
    {
      var query = new GetHistoricConsumptionQuery
      {
        Dto = new HistoricConsumptionDto
        {
          LocationId = 600,
          StartDate = new DateTime(2020, 12, 1),
          EndDate = new DateTime(2020, 12, 3),
          Interval = Domain.Enums.Interval.WEEK
        }
      };

      var handler = new GetHistoricConsumptionQuery.GetHistoricConsumptionQueryHandler(_context);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(query, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_MonthlyInterval()
    {
      var query = new GetHistoricConsumptionQuery
      {
        Dto = new HistoricConsumptionDto
        {
          LocationId = 601,
          StartDate = new DateTime(2020, 1, 1),
          EndDate = new DateTime(2020, 12, 31),
          Interval = Domain.Enums.Interval.MONTH
        }
      };

      var handler = new GetHistoricConsumptionQuery.GetHistoricConsumptionQueryHandler(_context);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().NotBeEmpty();
      result.Count().Should().Be(12);
      Math.Round(result[0].FuelConsumed, 2).Should().Be(465.0);
      Math.Round(result[1].FuelConsumed, 2).Should().Be(435.0);
      Math.Round(result[2].FuelConsumed, 2).Should().Be(457.38);
      Math.Round(result[3].FuelConsumed, 2).Should().Be(442.62);
      Math.Round(result[4].FuelConsumed, 2).Should().Be(254.1);
      Math.Round(result[5].FuelConsumed, 2).Should().Be(245.90);
      Math.Round(result[6].FuelConsumed, 2).Should().Be(400.0);
      Math.Round(result[7].FuelConsumed, 2).Should().Be(400.0);
      Math.Round(result[8].FuelConsumed, 2).Should().Be(295.08);
      Math.Round(result[9].FuelConsumed, 2).Should().Be(304.92);
      Math.Round(result[10].FuelConsumed, 2).Should().Be(0.0);
      Math.Round(result[11].FuelConsumed, 2).Should().Be(0.0);
    }

    [Fact]
    public async Task Handle_MonthlyIntervalOneRefill()
    {
      var query = new GetHistoricConsumptionQuery
      {
        Dto = new HistoricConsumptionDto
        {
          LocationId = 602,
          StartDate = new DateTime(2020, 1, 1),
          EndDate = new DateTime(2020, 12, 31),
          Interval = Domain.Enums.Interval.MONTH
        }
      };

      var handler = new GetHistoricConsumptionQuery.GetHistoricConsumptionQueryHandler(_context);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(query, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_MonthlyIntervalRefillOutsidePeriod()
    {
      var query = new GetHistoricConsumptionQuery
      {
        Dto = new HistoricConsumptionDto
        {
          LocationId = 603,
          StartDate = new DateTime(2020, 1, 1),
          EndDate = new DateTime(2020, 12, 31),
          Interval = Domain.Enums.Interval.MONTH
        }
      };

      var handler = new GetHistoricConsumptionQuery.GetHistoricConsumptionQueryHandler(_context);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().NotBeEmpty();
      result.Count().Should().Be(12);
      Math.Round(result[0].FuelConsumed, 2).Should().Be(72.6);
      Math.Round(result[1].FuelConsumed, 2).Should().Be(67.92);
      Math.Round(result[2].FuelConsumed, 2).Should().Be(72.6);
      Math.Round(result[3].FuelConsumed, 2).Should().Be(70.26);
      Math.Round(result[4].FuelConsumed, 2).Should().Be(72.6);
      Math.Round(result[5].FuelConsumed, 2).Should().Be(70.26);
      Math.Round(result[6].FuelConsumed, 2).Should().Be(72.6);
      Math.Round(result[7].FuelConsumed, 2).Should().Be(72.6);
      Math.Round(result[8].FuelConsumed, 2).Should().Be(70.26);
      Math.Round(result[9].FuelConsumed, 2).Should().Be(72.6);
      Math.Round(result[10].FuelConsumed, 2).Should().Be(70.26);
      Math.Round(result[11].FuelConsumed, 2).Should().Be(72.6);
    }

    [Fact]
    public async Task Handle_YearlyInterval()
    {
      var query = new GetHistoricConsumptionQuery
      {
        Dto = new HistoricConsumptionDto
        {
          LocationId = 604,
          StartDate = new DateTime(2015, 1, 1),
          EndDate = new DateTime(2020, 12, 31),
          Interval = Domain.Enums.Interval.YEAR
        }
      };

      var handler = new GetHistoricConsumptionQuery.GetHistoricConsumptionQueryHandler(_context);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().NotBeEmpty();
      result.Count().Should().Be(6);
      Math.Round(result[0].FuelConsumed, 2).Should().Be(1000);
      Math.Round(result[1].FuelConsumed, 2).Should().Be(1000);
      Math.Round(result[2].FuelConsumed, 2).Should().Be(1000);
      Math.Round(result[3].FuelConsumed, 2).Should().Be(1000);
      Math.Round(result[4].FuelConsumed, 2).Should().Be(0);
      Math.Round(result[5].FuelConsumed, 2).Should().Be(0);
    }
  }
}

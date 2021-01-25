using Domain.EntityExtensions;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.EntityExtentions.LocationExtensions
{
  public class LocationExtensionsTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_CalculateFuelConsumption()
    {
      var location = await Context.Locations.Include(x => x.Refills).FirstOrDefaultAsync(x => x.Id == 5);
      var fuelConsumption = location.FuelConsumptionPerDegreeOfHeating();

      fuelConsumption.Should().Be(800.0 / 315.0);
    }

    [Fact]
    public async Task Handle_NoRefillsForLocation()
    {
      var location = await Context.Locations.Include(x => x.Refills).FirstOrDefaultAsync(x => x.Id == 6);
      var fuelConsumption = location.FuelConsumptionPerDegreeOfHeating();
      fuelConsumption.Should().Be(location.EstimateFuelConsumption);

    }

    [Fact]
    public async Task Handle_NoTemperatureForLocation()
    {
      var location = await Context.Locations.Include(x => x.Refills).FirstOrDefaultAsync(x => x.Id == 7);

      Assert.Throws<ArgumentException>(
        () => { var fuelConsumption = location.FuelConsumptionPerDegreeOfHeating(); }
      );
    }

    [Fact]
    public async Task Handle_EstimateYearlyFuelConsumptionNoRefillsRegistered()
    {
      var location = await Context.Locations
        .Include(x => x.Region)
        .ThenInclude(x => x.DailyTemperatures)
        .Include(x => x.Refills)
        .FirstOrDefaultAsync(x => x.Id == 300);

      var result = location.EstimatedYearlyFuelConsumption(1950);
      result.Should().Be(949000);
    }

    [Fact]
    public async Task Handle_EstimateYearlyFuelConsumptionRefillsRegistered()
    {
      var location = await Context.Locations
        .Include(x => x.Region)
        .ThenInclude(x => x.DailyTemperatures)
        .Include(x => x.Refills)
        .FirstOrDefaultAsync(x => x.Id == 301);

      var result = location.EstimatedYearlyFuelConsumption(1950);
      result.Should().Be(32850);
    }

    [Fact]
    public async Task Handle_EstimateYearlyFuelConsumptionNoTemperatures()
    {
      var location = await Context.Locations
        .Include(x => x.Region)
        .ThenInclude(x => x.DailyTemperatures)
        .Include(x => x.Refills)
        .FirstOrDefaultAsync(x => x.Id == 302);

      Assert.Throws<ArgumentException>(
        () => { var result = location.EstimatedYearlyFuelConsumption(1950); }
      );

    }
    public async Task Handle_PredictCorrectDayForRefillOnlyOneRefillFound()
    {
      var location = await Context.Locations
        .Include(x => x.FuelTank)
        .Include(x => x.Refills)
        .Include(x => x.Region)
        .ThenInclude(x => x.DailyTemperatures)
        .FirstOrDefaultAsync(x => x.Id == 200);

      var date = location.PredictDayReachingMinimumFuelLevel();
      date.Should().Be(new DateTime(1990, 5, 1));
    }

    [Fact]
    public async Task Handle_PredictCorrectDayForRefill()
    {
      var location = await Context.Locations
        .Include(x => x.FuelTank)
        .Include(x => x.Refills)
        .Include(x => x.Region)
        .ThenInclude(x => x.DailyTemperatures)
        .FirstOrDefaultAsync(x => x.Id == 201);

      var date = location.PredictDayReachingMinimumFuelLevel();
      date.Should().Be(new DateTime(1990, 5, 8));
    }

    [Fact]
    public async Task Handle_PredictCorrectDayNoPreviousRefills()
    {
      var location = await Context.Locations
        .Include(x => x.FuelTank)
        .Include(x => x.Refills)
        .Include(x => x.Region)
        .ThenInclude(x => x.DailyTemperatures)
        .FirstOrDefaultAsync(x => x.Id == 202);

      var date = location.PredictDayReachingMinimumFuelLevel();
      date.Year.Should().Be(DateTime.UtcNow.Year);
      date.DayOfYear.Should().Be(DateTime.UtcNow.DayOfYear);
    }
  }
}

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

      Assert.Throws<ArgumentException>(
        () => { var fuelConsumption = location.FuelConsumptionPerDegreeOfHeating(); }
      );
    }

    [Fact]
    public async Task Handle_NoTemperatureForLocation()
    {
      var location = await Context.Locations.Include(x => x.Refills).FirstOrDefaultAsync(x => x.Id == 7);

      Assert.Throws<ArgumentException>(
        () => { var fuelConsumption = location.FuelConsumptionPerDegreeOfHeating(); }
      );
    }
  }
}
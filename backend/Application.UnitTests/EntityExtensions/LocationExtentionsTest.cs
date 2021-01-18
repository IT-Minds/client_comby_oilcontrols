using Domain.EntityExtensions;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.EntityExtentions.LocationExtensions
{
  public class LocationExtensionsTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_CalculateFuelConsumption()
    {
      var location = await Context.Locations.FindAsync(5);
      var fuelConsumption = location.FuelConsumptionPerDegreeOfHeating();

      fuelConsumption.Should().Be(800.0 / 315.0);
    }
  }
}
using Domain.EntityExtensions;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.EntityExtensions.RegionExtensions
{
  public class RegionTemperatureTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_CalculateCorrectAvgTemperature()
    {
      var region = await Context.Regions.Include(x => x.DailyTemperatures).FirstOrDefaultAsync(x => x.Id == 1);
      var avgTemp = region.DailyTemperatureEstimate(new DateTime(2000, 1, 1));

      avgTemp.Should().Be(-14.0 / 9.0);
    }

    [Fact]
    public async Task Handle_DivideByZero()
    {
      var region = await Context.Regions.Include(x => x.DailyTemperatures).FirstOrDefaultAsync(x => x.Id == 1);
      Assert.Throws<ArgumentException>(
         () => { var avgTemp = region.DailyTemperatureEstimate(new DateTime(2000, 2, 1)); }
      );
    }
  }
}
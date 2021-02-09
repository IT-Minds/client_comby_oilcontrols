using Domain.EntityExtensions;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.EntityExtensions.TruckExtension
{
  public class TruckExtensionTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_CalculateEveningAmountNoFuelChange()
    {
      var truck = await Context.Trucks
        .Where(x => x.Id == 100)
        .Include(x => x.DailyStates)
          .ThenInclude(x => x.TruckRefills)
        .Include(x => x.Refills)
        .FirstOrDefaultAsync();

      var eveningQuantity = truck.EveningQuantity(new System.DateTime(2020, 1, 1));
      eveningQuantity.Should().Be(1000);
    }

    [Fact]
    public async Task Handle_CalculateEveningAmountFuelChange()
    {
      var truck = await Context.Trucks
        .Where(x => x.Id == 100)
        .Include(x => x.DailyStates)
          .ThenInclude(x => x.TruckRefills)
          .Include(x => x.Refills)
        .FirstOrDefaultAsync();

      var eveningQuantity = truck.EveningQuantity(new System.DateTime(2020, 1, 2));
      eveningQuantity.Should().Be(2000);
    }

    [Fact]
    public async Task Handle_CalculateEveningAmountFuelChangeBackAndForth()
    {
      var truck = await Context.Trucks
        .Where(x => x.Id == 100)
        .Include(x => x.DailyStates)
          .ThenInclude(x => x.TruckRefills)
        .Include(x => x.Refills)
        .FirstOrDefaultAsync();

      var eveningQuantity = truck.EveningQuantity(new System.DateTime(2020, 1, 3));
      eveningQuantity.Should().Be(2500);
    }

    [Fact]
    public async Task Handle_CalculateEveningAmountNothingRegistered()
    {
      var truck = await Context.Trucks
        .Where(x => x.Id == 100)
        .Include(x => x.DailyStates)
          .ThenInclude(x => x.TruckRefills)
        .Include(x => x.Refills)
        .FirstOrDefaultAsync();

      Assert.Throws<ArgumentException>(
        () => { var eveningQuantity = truck.EveningQuantity(new System.DateTime(2020, 1, 4)); }
      );
    }

    [Fact]
    public async Task Handle_CalculateEveningAmountNoDeliveries()
    {
       var truck = await Context.Trucks
        .Where(x => x.Id == 100)
        .Include(x => x.DailyStates)
          .ThenInclude(x => x.TruckRefills)
        .Include(x => x.Refills)
        .FirstOrDefaultAsync();

      var eveningQuantity = truck.EveningQuantity(new System.DateTime(2020, 1, 5));
      eveningQuantity.Should().Be(1000);
    }
  }
}

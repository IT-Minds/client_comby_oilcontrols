using Application.DailyTemperatures.Commands.CreateDailyTemperature;
using Domain.Enums;
using FluentAssertions;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.DailyTemperatures.Commands.CreateDailyTemperature
{
  public class CreateDailyTemperatureCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistDailyTemperature()
    {
      var command = new CreateDailyTemperatureCommand
      {
        RegionId = 1,
        Date = new DateTime(2020, 12, 15),
        Temperature = 5
      };

      var handler = new CreateDailyTemperatureCommand.CreateDailyTemperatureCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.RegionDailyTemps.Find(result);
      entity.Should().NotBeNull();
      entity.RegionId.Should().Be(command.RegionId);
      entity.Temperature.Should().Be(command.Temperature);
    }

    [Fact]
    public async Task Handle_NonExistentRegion()
    {
      var command = new CreateDailyTemperatureCommand
      {
        RegionId = -100,
        Date = new DateTime(2020, 12, 15),
        Temperature = 5
      };

      var handler = new CreateDailyTemperatureCommand.CreateDailyTemperatureCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_MultipleTemperaturesForSameDay()
    {
      var command1 = new CreateDailyTemperatureCommand
      {
        RegionId = 1,
        Date = new DateTime(2020, 12, 15),
        Temperature = 5
      };
      var command2 = new CreateDailyTemperatureCommand
      {
        RegionId = 1,
        Date = new DateTime(2020, 12, 15),
        Temperature = 10
      };

      var handler = new CreateDailyTemperatureCommand.CreateDailyTemperatureCommandHandler(Context);
      await handler.Handle(command1, CancellationToken.None);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command2, CancellationToken.None); }
      );
    }
  }
}
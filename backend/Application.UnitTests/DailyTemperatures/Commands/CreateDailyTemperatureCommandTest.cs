using Application.DailyTemperatures;
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
        Dto = new TemperatureDto
        {
          RegionId = 1,
          Date = new DateTime(2020, 12, 15),
          Temperature = 5
        }
      };

      var handler = new CreateDailyTemperatureCommand.CreateDailyTemperatureCommandHandler(Context, Mapper);
      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.RegionDailyTemps.Find(result.Id);
      entity.Should().NotBeNull();
      entity.RegionId.Should().Be(command.Dto.RegionId);
      entity.Temperature.Should().Be(command.Dto.Temperature);
    }

    [Fact]
    public async Task Handle_NonExistentRegion()
    {
      var command = new CreateDailyTemperatureCommand
      {
        Dto = new TemperatureDto
        {
          RegionId = -100,
          Date = new DateTime(2020, 12, 15),
          Temperature = 5
        }
      };

      var handler = new CreateDailyTemperatureCommand.CreateDailyTemperatureCommandHandler(Context, Mapper);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_MultipleTemperaturesForSameDay()
    {
      var command1 = new CreateDailyTemperatureCommand
      {
        Dto = new TemperatureDto
        {
          RegionId = 1,
          Date = new DateTime(2020, 12, 15),
          Temperature = 5
        }

      };
      var command2 = new CreateDailyTemperatureCommand
      {
        Dto = new TemperatureDto
        {
          RegionId = 1,
          Date = new DateTime(2020, 12, 15),
          Temperature = 10
        }

      };

      var handler = new CreateDailyTemperatureCommand.CreateDailyTemperatureCommandHandler(Context, Mapper);
      await handler.Handle(command1, CancellationToken.None);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command2, CancellationToken.None); }
      );
    }
  }
}
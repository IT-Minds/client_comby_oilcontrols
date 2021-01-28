using Application.Common.Exceptions;
using Application.Common.Options;
using Application.ExampleEntities.Commands.CreateExampleEntity;
using Application.Locations.Commands.UpdateLocationMetaData;
using Domain.Enums;
using FluentAssertions;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.Locations.Commands.UpdateLocationMetaData
{
  public class UpdateLocationMetaDataCommandTest : CommandTestBase
  {
    [Fact(Skip = "Histories created async")]
    public async Task Handle_ShouldPersistNewData()
    {
      var command = new UpdateLocationMetaDataCommand
      {
        Id = 1,
        Address = "This is address 23",
        Comment = "This is comment.",
        Refillschedule = RefillSchedule.AUTOMATIC,
        TankType = TankType.BUILDING,
        TankNumber = 443,
        TankCapacity = 4005.1,
        MinimumFuelAmount = 50.5,
        EstimateConsumption = 10,
        FuelType = FuelType.OTHER,
        DaysBetweenRefills = 15
      };
      var oldLocation = Context.Locations.Find(1);
      var historyNumber = oldLocation.LocationHistories == null ? 0 : oldLocation.LocationHistories.Count();

      var handler = new UpdateLocationMetaDataCommand.UpdateLocationMetaDataCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Locations.Find(result);
      var newestHistory = entity.LocationHistories.OrderByDescending(x => x.Created).FirstOrDefault();

      entity.Should().NotBeNull();
      entity.Address.Should().Be(command.Address);
      entity.Comments.Should().Be(command.Comment);
      entity.Schedule.Should().Be(command.Refillschedule);
      entity.DaysBetweenRefills.Should().Be(command.DaysBetweenRefills);
      entity.EstimateFuelConsumption.Should().Be(command.EstimateConsumption);
      entity.FuelTank.TankType.Should().Be(command.TankType);
      entity.FuelTank.TankNumber.Should().Be(command.TankNumber);
      entity.FuelTank.TankCapacity.Should().Be(command.TankCapacity);
      entity.FuelTank.MinimumFuelAmount.Should().Be(command.MinimumFuelAmount);
      entity.FuelTank.FuelType.Should().Be(command.FuelType);
      entity.EstimateFuelConsumption.Should().Be(command.EstimateConsumption);
      entity.LocationHistories.Count().Should().Be(historyNumber + 1);
      newestHistory.Should().NotBeNull();
      newestHistory.LocationId.Should().Be(entity.Id);
      newestHistory.RegionId.Should().Be(entity.RegionId);
      newestHistory.Schedule.Should().Be(entity.Schedule);
      newestHistory.Address.Should().Be(entity.Address);
      newestHistory.Comments.Should().Be(entity.Comments);
      entity.Debtors.Count().Should().Be(1);
    }

    [Fact]
    public async Task Handle_NoSuchLocation()
    {
      var command = new UpdateLocationMetaDataCommand
      {
        Id = -1,
        Address = "This is address 23",
        Comment = "This is comment.",
        Refillschedule = RefillSchedule.AUTOMATIC,
        TankType = TankType.BUILDING,
        TankNumber = 443,
        TankCapacity = 4005.1,
        MinimumFuelAmount = 50.5,
        EstimateConsumption = 10,
        FuelType = FuelType.OTHER,
        DaysBetweenRefills = 15
      };

      var handler = new UpdateLocationMetaDataCommand.UpdateLocationMetaDataCommandHandler(Context);

      await Assert.ThrowsAsync<NotFoundException>(
        async () => { var result = await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact(Skip = "not fully implemented yet.")]
    public async Task Handle_NoFuelTank()
    {
      var command = new UpdateLocationMetaDataCommand
      {
        Id = 1,
        Address = "This is address 23",
        Comment = "This is comment.",
        Refillschedule = RefillSchedule.AUTOMATIC,
        TankType = TankType.BUILDING,
        TankNumber = 443,
        TankCapacity = 4005.1,
        MinimumFuelAmount = 50.5,
        EstimateConsumption = 10
      };

      var handler = new UpdateLocationMetaDataCommand.UpdateLocationMetaDataCommandHandler(Context);

      await Assert.ThrowsAsync<NotFoundException>(
        async () => { var result = await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}

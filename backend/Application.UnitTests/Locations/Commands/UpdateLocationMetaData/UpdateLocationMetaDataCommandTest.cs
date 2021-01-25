using Application.Common.Exceptions;
using Application.Common.Options;
using Application.ExampleEntities.Commands.CreateExampleEntity;
using Application.Locations.Commands.UpdateLocationMetaData;
using Domain.Enums;
using FluentAssertions;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.Locations.Commands.UpdateLocationMetaData
{
  public class UpdateLocationMetaDataCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistNewData()
    {
      var command = new UpdateLocationMetaDataCommand
      {
        LocationId = 1,
        Address = "This is address 23",
        Comment = "This is comment.",
        Refillschedule = RefillSchedule.AUTOMATIC,
        TankType = TankType.BUILDING,
        TankNumber = 443,
        TankCapacity = 4005.1,
        MinimumFuelAmount = 50.5,
        EstimateConsumption = 10
      };
      var oldLocation = Context.Locations.Find(1);
      var historyNumber = oldLocation.LocationHistories == null ? 0 : oldLocation.LocationHistories.Count();

      oldLocation = new Domain.Entities.Location
      {
        Address = oldLocation.Address,
        Comments = oldLocation.Comments,
        Schedule = oldLocation.Schedule,
        Region = oldLocation.Region,
        FuelTank = oldLocation.FuelTank,
        Refills = oldLocation.Refills,
        DaysBetweenRefills = oldLocation.DaysBetweenRefills,
        EstimateFuelConsumption = oldLocation.EstimateFuelConsumption

      };


      var handler = new UpdateLocationMetaDataCommand.UpdateLocationMetaDataCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Locations.Find(result);
      var newestHistory = entity.LocationHistories.OrderByDescending(x => x.Created).FirstOrDefault();

      entity.Should().NotBeNull();
      entity.Address.Should().Be(command.Address);
      entity.Comments.Should().Be(command.Comment);
      entity.Schedule.Should().Be(command.Refillschedule);
      entity.FuelTank.TankType.Should().Be(command.TankType);
      entity.FuelTank.TankNumber.Should().Be(command.TankNumber);
      entity.FuelTank.TankCapacity.Should().Be(command.TankCapacity);
      entity.FuelTank.MinimumFuelAmount.Should().Be(command.MinimumFuelAmount);
      entity.EstimateFuelConsumption.Should().Be(command.EstimateConsumption);
      entity.LocationHistories.Count().Should().Be(historyNumber + 1);
      newestHistory.LocationId.Should().Be(entity.Id);
      newestHistory.RegionId.Should().Be(oldLocation.RegionId);
      newestHistory.Schedule.Should().Be(oldLocation.Schedule);
      newestHistory.Address.Should().Be(oldLocation.Address);
      newestHistory.Comments.Should().Be(oldLocation.Comments);
    }

    [Fact]
    public async Task Handle_NoSuchLocation()
    {
      var command = new UpdateLocationMetaDataCommand
      {
        LocationId = -1,
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

    [Fact(Skip = "not fully implemented yet.")]
    public async Task Handle_NoFuelTank()
    {
      var command = new UpdateLocationMetaDataCommand
      {
        LocationId = 1,
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

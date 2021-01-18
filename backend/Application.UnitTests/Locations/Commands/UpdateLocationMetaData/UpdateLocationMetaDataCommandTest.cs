using Application.Common.Options;
using Application.ExampleEntities.Commands.CreateExampleEntity;
using Application.Locations.Commands.UpdateLocationMetaData;
using Domain.Enums;
using FluentAssertions;
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
        Refillschedule = RefillSchedule.AUTOMAIC,
        TankType = TankType.BUILDING,
        TankNumber = 443,
        TankCapacity = 4005.1,
        MinimumFuelAmount = 50.5,
        EstimateConsumption = 10
      };

      var handler = new UpdateLocationMetaDataCommand.UpdateLocationMetaDataCommandHandler(Context, null);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Locations.Find(result);

      entity.Should().NotBeNull();
      entity.Address.Should().Be(command.Address);
      entity.Comments.Should().Be(command.Comment);
      entity.Schedule.Should().Be(command.Refillschedule);
      entity.FuelTank.Type.Should().Be(command.TankType);
      entity.FuelTank.TankNumber.Should().Be(command.TankNumber);
      entity.FuelTank.TankCapacity.Should().Be(command.TankCapacity);
      entity.FuelTank.MinimumFuelAmount.Should().Be(command.MinimumFuelAmount);
    }
  }
}

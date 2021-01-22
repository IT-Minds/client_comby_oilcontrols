using System.Threading;
using System.Threading.Tasks;
using Application.Locations.Commands.CreateLocation;
using Domain.Enums;
using FluentAssertions;
using Xunit;

namespace Application.UnitTests.Locations.Commands.CreateLocations
{
  public class CreateLocationCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistNewData()
    {
      var command = new CreateLocationCommand
      {
        Address = "This is address 23",
        Comment = "This is comment.",
        Refillschedule = RefillSchedule.AUTOMAIC,
        TankType = TankType.BUILDING,
        TankNumber = 9696,
        TankCapacity = 4005.1,
        MinimumFuelAmount = 50.5,
        EstimateConsumption = 10
      };

      var handler = new CreateLocationCommand.CreateLocationCommandHandler(Context);
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
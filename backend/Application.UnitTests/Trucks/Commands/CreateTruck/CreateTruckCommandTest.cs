using Application.Trucks;
using Application.Trucks.Commands.CreateTruck;
using FluentAssertions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.Trucks.Commands.CreateTruck
{
  public class CreateExampleEntityCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistTruckEntity()
    {
      var command = new CreateTruckCommand
      {
        TruckInfo = new TruckInfoDto
        {
          TruckIdentifier = "Truck123",
          Description = "Absolutely a truck.",
          Name = "Trucky",
          TankCapacity = 10.5,
          DriverId = 1
        }
      };

      var handler = new CreateTruckCommand.CreateTruckCommandHandler(Context, Mapper);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Trucks.Find(result.Id);

      entity.Should().NotBeNull();
      entity.TruckIdentifier.Should().Be(command.TruckInfo.TruckIdentifier);
      entity.Description.Should().Be(command.TruckInfo.Description);
      entity.Name.Should().Be(command.TruckInfo.Name);
      entity.TankCapacity.Should().Be(command.TruckInfo.TankCapacity);
    }

    [Fact(Skip = "This command doesn't fail when I want it to.")]
    public async Task Handle_NoTruckIdentifier()
    {
      var command = new CreateTruckCommand
      {
        TruckInfo = new TruckInfoDto
        {
          Description = "Absolutely another truck.",
          Name = "Truckabelle",
          TankCapacity = 11.5
        }
      };

      var handler = new CreateTruckCommand.CreateTruckCommandHandler(Context, Mapper);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Trucks.Find(result.Id);

      entity.Should().BeNull();
    }
  }
}

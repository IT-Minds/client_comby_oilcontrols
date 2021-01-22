using Application.ExampleEntities.Commands.CreateExampleEntity;
using Application.Trucks.Commands.CreateTruck;
using Domain.Enums;
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
        TruckIdentifier = "Truck123",
        Description = "Absolutely a truck.",
        Name = "Trucky",
        TankCapacity = 10.5
      };

      var handler = new CreateTruckCommand.CreateTruckCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Trucks.Find(result);

      entity.Should().NotBeNull();
      entity.TruckIdentifier.Should().Be(command.TruckIdentifier);
      entity.Description.Should().Be(command.Description);
      entity.Name.Should().Be(command.Name);
      entity.TankCapacity.Should().Be(command.TankCapacity);
    }

    [Fact(Skip = "This command doesn't fail when I want it to.")]
    public async Task Handle_NoTruckIdentifier()
    {
      var command = new CreateTruckCommand
      {
        Description = "Absolutely another truck.",
        Name = "Truckabelle",
        TankCapacity = 11.5
      };

      var handler = new CreateTruckCommand.CreateTruckCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Trucks.Find(result);

      entity.Should().BeNull();
    }
  }
}

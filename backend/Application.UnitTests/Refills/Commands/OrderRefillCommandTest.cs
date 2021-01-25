using System.Threading.Tasks;
using Xunit;
using System;
using Application.Refills.Commands.OrderRefill;
using System.Threading;
using FluentAssertions;
using System.Linq;
using Application.Common.Exceptions;

namespace Application.UnitTests.Refills.Commands.OrderRefill
{
  public class OrderRefillCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistRefillEntity()
    {
      var command = new OrderRefillCommand
      {
        LocationId = 1,
        TruckId = 43,
        ExpectedDeliveryDate = new DateTime(2020, 12, 17)
      };

      var handler = new OrderRefillCommand.OrderRefillCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Refills.Find(result);
      var route = Context.Routes.FirstOrDefault(x => x.Refills.Contains(entity));
      var truck = Context.Trucks.FirstOrDefault(x => x.RouteId == route.Id);

      entity.Should().NotBeNull();
      entity.LocationId.Should().Be(command.LocationId);
      route.Should().NotBeNull();
      truck.Id.Should().Be(command.TruckId);
    }

    [Fact]
    public async Task Handle_ShouldRemoveExistingRefillFromRoute()
    {
      var command1 = new OrderRefillCommand
      {
        LocationId = 1,
        TruckId = 43,
        ExpectedDeliveryDate = new DateTime(2020, 12, 17)
      };

      var handler = new OrderRefillCommand.OrderRefillCommandHandler(Context);
      await handler.Handle(command1, CancellationToken.None);

      var truck = Context.Trucks.FirstOrDefault(x => x.Id == command1.TruckId);
      var route = Context.Routes.FirstOrDefault(x => x.Id == truck.RouteId);
      var locationCount = route.Refills.Where(x => x.LocationId == command1.LocationId).Count();

      var command2 = new OrderRefillCommand
      {
        LocationId = 1,
        TruckId = 43,
        ExpectedDeliveryDate = new DateTime(2020, 12, 31)
      };
      var result = await handler.Handle(command2, CancellationToken.None);
      var entity = Context.Refills.Find(result);
      truck = Context.Trucks.FirstOrDefault(x => x.Id == command2.TruckId);
      route = Context.Routes.FirstOrDefault(x => x.Id == truck.RouteId);
      var locationCountPost = route.Refills.Where(x => x.LocationId == command2.LocationId).Count();

      locationCount.Should().Be(locationCountPost);
      entity.Should().NotBeNull();
      entity.LocationId.Should().Be(command2.LocationId);
      entity.ExpectedDeliveryDate.Should().Be(command2.ExpectedDeliveryDate);
    }

    [Fact]
    public async Task Handle_InvalidRoute()
    {
      var command1 = new OrderRefillCommand
      {
        LocationId = 1,
        TruckId = -500,
        ExpectedDeliveryDate = new DateTime(2020, 12, 17)
      };

      var handler = new OrderRefillCommand.OrderRefillCommandHandler(Context);

      await Assert.ThrowsAsync<NotFoundException>(
        async () => { await handler.Handle(command1, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_InvalidLocation()
    {
      var command1 = new OrderRefillCommand
      {
        LocationId = -100,
        TruckId = 43,
        ExpectedDeliveryDate = new DateTime(2020, 12, 17)
      };

      var handler = new OrderRefillCommand.OrderRefillCommandHandler(Context);

      await Assert.ThrowsAsync<NotFoundException>(
        async () => { await handler.Handle(command1, CancellationToken.None); }
      );
    }
  }
}

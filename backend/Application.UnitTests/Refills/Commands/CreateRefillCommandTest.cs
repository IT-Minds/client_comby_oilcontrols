using FluentAssertions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using System;
using Application.Refills.Commands.CreateRefill;

namespace Application.UnitTests.Refills.Commands.CreateRefill
{
  public class CreateRefillCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistRefillEntity()
    {
      var command = new CreateRefillCommand
      {
        TruckId = 43,
        StartAmount = 100,
        EndAmount = 150,
        CouponNumber = 19991,
        ExpectedDeliveryDate = new DateTime(),
        FuelType = Domain.Enums.FuelType.GASOLINE,
        TankState = Domain.Enums.TankState.FULL,
        TankType = Domain.Enums.TankType.BUILDING,
        TankNumber = 443
      };

      var handler = new CreateRefillCommand.CreateRefillCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Refills.Find(result);

      entity.Should().NotBeNull();
      entity.StartAmount.Should().Be(command.StartAmount);
      entity.EndAmount.Should().Be(command.EndAmount);
      entity.Coupon.CouponNumber.Should().Be(command.CouponNumber);
      entity.ExpectedDeliveryDate.Should().Be(command.ExpectedDeliveryDate);
      // entity.Type.Should().Be(command.FuelType);
      entity.TankState.Should().Be(command.TankState);
      entity.Location.FuelTank.TankType.Should().Be(command.TankType);
      entity.Location.FuelTank.TankNumber.Should().Be(command.TankNumber);
    }

    [Fact]
    public async Task Handle_FailSinceSmallerCouponExists()
    {
      var command = new CreateRefillCommand
      {
        TruckId = 43,
        StartAmount = 100,
        EndAmount = 150,
        CouponNumber = 19997,
        ExpectedDeliveryDate = new DateTime(),
        FuelType = Domain.Enums.FuelType.GASOLINE,
        TankState = Domain.Enums.TankState.FULL,
        TankType = Domain.Enums.TankType.BUILDING,
        TankNumber = 443
      };

      var handler = new CreateRefillCommand.CreateRefillCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }

    [Fact]
    public async Task Handle_InvalidCouponNumber()
    {
      var command = new CreateRefillCommand
      {
        TruckId = 43,
        StartAmount = 100,
        EndAmount = 150,
        CouponNumber = 0,
        ExpectedDeliveryDate = new DateTime(),
        FuelType = Domain.Enums.FuelType.GASOLINE,
        TankState = Domain.Enums.TankState.FULL,
        TankType = Domain.Enums.TankType.BUILDING,
        TankNumber = 443
      };

      var handler = new CreateRefillCommand.CreateRefillCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}

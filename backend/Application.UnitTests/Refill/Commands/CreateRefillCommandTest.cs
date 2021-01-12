using Application.Refill.Commands.CreateRefill;
using Domain.Enums;
using FluentAssertions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using System;

namespace Application.UnitTests.Refill.Commands.CreateRefill
{
  public class CreateRefillCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistRefillEntity()
    {
      var command = new CreateRefillCommand
      {
        TruckId = 1,
        Amount = 100,
        CouponNumber = 1001,
        Date = new DateTime(),
        FuelType = Domain.Enums.FuelType.PETROLEUM,
        TankState = Domain.Enums.TankState.FULL,
        TankType = Domain.Enums.TankType.BUILDING,
        TankNumber = 80
      };

      var handler = new CreateRefillCommand.CreateRefillCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entity = Context.Refills.Find(result);

      entity.Should().NotBeNull();
      entity.Amount.Should().Be(command.Amount);
      entity.Coupon.CouponNumber.Should().Be(command.CouponNumber);
      entity.Date.Should().Be(command.Date);
      entity.Type.Should().Be(command.FuelType);
      entity.TankState.Should().Be(command.TankState);
      entity.Location.Type.Should().Be(command.TankType);
      entity.Location.TankNumber.Should().Be(command.TankNumber);
    }

    [Fact]
    public async Task Handle_FailSinceSmallerCouponExists()
    {
      var command = new CreateRefillCommand
      {
        TruckId = 2,
        Amount = 100,
        CouponNumber = 1003,
        Date = new DateTime(),
        FuelType = Domain.Enums.FuelType.PETROLEUM,
        TankState = Domain.Enums.TankState.FULL,
        TankType = Domain.Enums.TankType.BUILDING,
        TankNumber = 80
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
        TruckId = 2,
        Amount = 100,
        CouponNumber = 0,
        Date = new DateTime(),
        FuelType = Domain.Enums.FuelType.PETROLEUM,
        TankState = Domain.Enums.TankState.FULL,
        TankType = Domain.Enums.TankType.BUILDING,
        TankNumber = 80
      };

      var handler = new CreateRefillCommand.CreateRefillCommandHandler(Context);

      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}

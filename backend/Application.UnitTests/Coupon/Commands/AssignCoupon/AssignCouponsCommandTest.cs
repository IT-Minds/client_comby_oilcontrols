using Application.Coupons.Commands.AssignCoupons;
using Application.ExampleEntities.Commands.CreateExampleEntity;
using Domain.Enums;
using FluentAssertions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.Coupon.Commands.AssignCoupons
{
  public class AssignCouponsCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistCoupons()
    {
      var command = new AssignCouponsCommand
      {
        TruckId = 1337,
        CouponNumbers = new List<int> { 350, 351, 352, 353, 354 }
      };

      var handler = new AssignCouponsCommand.AssignCouponsCommandCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entities = Context.Coupons.Where(x => x.Truck.Id == 1337);

      entities.Should().NotBeEmpty();
      entities.Should().HaveCount(5);
    }

    [Fact]
    public async Task Handle_EmptyCouponList()
    {
      var command = new AssignCouponsCommand
      {
        TruckId = 1337,
        CouponNumbers = new List<int>()
      };

      var countBefore = Context.Coupons.Where(x => x.Truck.Id == 1337).ToList().Count;

      var handler = new AssignCouponsCommand.AssignCouponsCommandCommandHandler(Context);

      var result = await handler.Handle(command, CancellationToken.None);

      var entities = Context.Coupons.Where(x => x.Truck.Id == 1337);
      
      entities.Should().HaveCount(countBefore);
    }
  }
}

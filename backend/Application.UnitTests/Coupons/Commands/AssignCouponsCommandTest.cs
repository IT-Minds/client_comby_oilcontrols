using Application.Coupons.Commands.AssignCoupons;
using Application.ExampleEntities.Commands.CreateExampleEntity;
using Domain.Enums;
using FluentAssertions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.Coupons.Commands.AssignCoupons
{
  public class AssignCouponsCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistCoupons()
    {
      var command = new AssignCouponsCommand
      {
        Dto = new AssignCouponDto
        {
          TruckId = 43,
          CouponNumbers = new List<int> { 350, 351, 352, 353, 354 }
        }
      };
      var countBefore = Context.Coupons.Where(x => x.Truck.Id == 43).ToList().Count;
      var total = countBefore + 5;

      var handler = new AssignCouponsCommand.AssignCouponsCommandCommandHandler(Context, Mapper);

      var result = await handler.Handle(command, CancellationToken.None);

      var entities = Context.Coupons.Where(x => x.Truck.Id == 43);

      entities.Should().NotBeEmpty();
      entities.Should().HaveCount(total);
    }

    [Fact]
    public async Task Handle_EmptyCouponList()
    {
      var command = new AssignCouponsCommand
      {
        Dto = new AssignCouponDto
        {
          TruckId = 43,
          CouponNumbers = new List<int>()
        }
      };

      var countBefore = Context.Coupons.Where(x => x.Truck.Id == 43).ToList().Count;

      var handler = new AssignCouponsCommand.AssignCouponsCommandCommandHandler(Context, Mapper);

      var result = await handler.Handle(command, CancellationToken.None);

      var entities = Context.Coupons.Where(x => x.Truck.Id == 43);

      entities.Should().HaveCount(countBefore);
    }
  }
}

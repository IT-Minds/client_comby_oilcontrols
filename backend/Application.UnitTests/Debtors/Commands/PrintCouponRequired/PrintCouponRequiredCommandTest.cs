using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Debtors.PrintCouponRequired;
using FluentAssertions;
using Xunit;

namespace Application.UnitTests.Debtors.Commands.PrintCouponRequired
{
  public class PrintCouponRequiredCommandTest : CommandTestBase
  {
    [Fact]
    public async Task Handle_ShouldPersistChanges()
    {
      var command = new PrintCouponRequiredCommand
      {
        DebtorId = 500,
        PrintCouponRequired = true
      };
      var handler = new PrintCouponRequiredCommand.PrintCouponRequiredCommandHandler(Context);
      var result = await handler.Handle(command, CancellationToken.None);
      var entity = Context.Debtors.Find(result);
      entity.Should().NotBeNull();
      entity.CouponRequired.Should().Be(command.PrintCouponRequired);
    }

    [Fact]
    public async Task Handle_NoSuchDebtor()
    {
      var command = new PrintCouponRequiredCommand
      {
        DebtorId = -500,
        PrintCouponRequired = true
      };
      var handler = new PrintCouponRequiredCommand.PrintCouponRequiredCommandHandler(Context);
      await Assert.ThrowsAsync<ArgumentException>(
        async () => { await handler.Handle(command, CancellationToken.None); }
      );
    }
  }
}
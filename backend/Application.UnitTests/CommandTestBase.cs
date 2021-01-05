using Infrastructure.Persistence;
using System;

namespace Application.UnitTests
{
  public class CommandTestBase : IDisposable
  {
    public CommandTestBase()
    {
      Context = ApplicationDbContextFactory.Create();
    }

    public ApplicationDbContext Context { get; }

    public void Dispose()
    {
      ApplicationDbContextFactory.Destroy(Context);
    }
  }
}

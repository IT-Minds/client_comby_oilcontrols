using Application.Common.Mappings;
using AutoMapper;
using Infrastructure.Persistence;
using System;
using Xunit;

namespace Application.UnitTests
{
  public sealed class QueryTestFixture : IDisposable
  {
    public QueryTestFixture()
    {
      Context = ApplicationDbContextFactory.Create();

      var configurationProvider = new MapperConfiguration(cfg =>
      {
        cfg.AddProfile<MappingProfile>();
      });

      Mapper = configurationProvider.CreateMapper();
    }
    public ApplicationDbContext Context { get; }

    public IMapper Mapper { get; }

    public void Dispose()
    {
      ApplicationDbContextFactory.Destroy(Context);
    }
  }

  [CollectionDefinition("QueryTests")]
  public class QueryCollection : ICollectionFixture<QueryTestFixture> { }
}

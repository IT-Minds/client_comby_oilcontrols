using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
  public interface IApplicationDbContext
  {

    public DbSet<Location> Locations { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<Domain.Entities.Refill> Refills { get; set; }
    public DbSet<Truck> Trucks { get; set; }
    public DbSet<Route> Routes { get; set; }
    DbSet<ExampleEntity> ExampleEntities { get; set; }
    DbSet<ExampleEntityList> ExampleEntityLists { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
  }
}

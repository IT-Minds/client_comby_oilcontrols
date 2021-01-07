using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
  public interface IApplicationDbContext
  {
    DbSet<ExampleEntity> ExampleEntities { get; set; }
    DbSet<ExampleEntityList> ExampleEntityLists { get; set; }
    DbSet<Building> Buildings {get; set;}
    DbSet<Coupon> Coupons { get; set; }
    DbSet<Domain.Entities.Refill> Refills { get; set; }
    DbSet<Truck> Trucks { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
  }
}

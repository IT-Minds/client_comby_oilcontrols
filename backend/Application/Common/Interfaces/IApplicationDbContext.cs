using Domain.Common;
using Domain.Entities;
using Domain.Entities.Refills;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
  public interface IApplicationDbContext
  {

    DbSet<Location> Locations { get; set; }
    DbSet<Coupon> Coupons { get; set; }
    DbSet<CompletedRefill> CompletedRefills { get; set; }
    DbSet<OrderedRefill> OrderedRefills { get; set; }
    DbSet<AssignedRefill> AssignedRefills { get; set; }
    DbSet<Truck> Trucks { get; set; }
    DbSet<Region> Regions { get; set; }
    DbSet<RegionDailyTemp> RegionDailyTemps { get; set; }
    DbSet<TruckDailyState> TruckDailyStates { get; set; }
    DbSet<TruckRefill> TruckRefills { get; set; }
    DbSet<FuelTank> FuelTanks { get; set; }
    DbSet<Street> Streets { get; set; }
    DbSet<LocationHistory> LocationHistories { get; set; }
    DbSet<Debtor> Debtors { get; set; }
    DbSet<LocationDebtor> LocationDebtors { get; set; }
    DbSet<LocationDebtorHistory> LocationDebtorHistories { get; set; }
    DbSet<User> Users { get; set; }
    DbSet<Role> Roles { get; set; }
    DbSet<RoleAction> RoleActions { get; set; }
    DbSet<UserRole> UserRoles { get; set; }
    DbSet<ExampleEntity> ExampleEntities { get; set; }
    DbSet<ExampleEntityList> ExampleEntityLists { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    int SaveChanges();
    EntityEntry Entry(AuditableEntity entity);
    void Replace<TEntity>(TEntity oldEntity, TEntity newEntity) where TEntity : AuditableEntity;
  }
}

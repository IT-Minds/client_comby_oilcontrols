using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
  public class ApplicationDbContext : DbContext, IApplicationDbContext
  {
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeOffsetService _dateTimeOffsetService;

    public ApplicationDbContext(
        DbContextOptions options,
        ICurrentUserService currentUserService,
        IDateTimeOffsetService dateTimeOffset) : base(options)
    {
      _currentUserService = currentUserService;
      _dateTimeOffsetService = dateTimeOffset;
    }

    public DbSet<ExampleEntity> ExampleEntities { get; set; }

    public DbSet<ExampleEntityList> ExampleEntityLists { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<Refill> Refills { get; set; }
    public DbSet<Truck> Trucks { get; set; }
    public DbSet<Route> Routes { get; set; }
    public DbSet<Region> Regions { get; set; }
    public DbSet<RegionDailyTemp> RegionDailyTemps { get; set; }
    public DbSet<TruckDailyState> TruckDailyStates { get; set; }
    public DbSet<TruckRefill> TruckRefills { get; set; }
    public DbSet<FuelTank> FuelTanks { get; set; }
    public DbSet<Street> Streets { get; set; }
    public DbSet<LocationHistory> LocationHistories { get; set; }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
      foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
      {
        switch (entry.State)
        {
          case EntityState.Added:
            entry.Entity.CreatedBy = _currentUserService.UserId;
            entry.Entity.Created = _dateTimeOffsetService.Now;
            entry.Entity.LastModifiedBy = _currentUserService.UserId;
            entry.Entity.LastModified = _dateTimeOffsetService.Now;
            entry.Entity.ModifiedCount = 0;
            break;
          case EntityState.Modified:
            entry.Entity.LastModifiedBy = _currentUserService.UserId;
            entry.Entity.LastModified = _dateTimeOffsetService.Now;
            entry.Entity.ModifiedCount++;
            break;
        }
      }

      return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

      base.OnModelCreating(builder);
    }
  }
}

using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
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
    public DbSet<Debtor> Debtors { get; set; }
    public DbSet<LocationDebtor> LocationDebtors { get; set; }

    public async override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
      var entities = ChangeTracker.Entries<AuditableEntity>();
      foreach (var entry in entities)
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

      OnLocationsChange(entities.Where(x => x.Entity.GetType().Equals(typeof(Location))), cancellationToken);

      var result = await base.SaveChangesAsync(cancellationToken);

      return result;
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

      base.OnModelCreating(builder);
    }

    private void OnLocationsChange(IEnumerable<EntityEntry<AuditableEntity>> entities, CancellationToken cancellationToken)
    {
      foreach (EntityEntry<AuditableEntity> entity in entities.ToList())
      {
        if (entity.State == EntityState.Added || entity.State == EntityState.Modified)
        {
          var locationHistory = new LocationHistory
          {
            RegionId = (entity.Entity as Location).RegionId,
            Schedule = (entity.Entity as Location).Schedule,
            Address = (entity.Entity as Location).Address,
            Comments = (entity.Entity as Location).Comments,
            Location = (entity.Entity as Location),
            CreatedBy = _currentUserService.UserId,
            Created = _dateTimeOffsetService.Now,
            LastModifiedBy = _currentUserService.UserId,
            LastModified = _dateTimeOffsetService.Now,
            ModifiedCount = 0,
          };

          this.LocationHistories.Add(locationHistory);
        }
      }
    }
  }
}

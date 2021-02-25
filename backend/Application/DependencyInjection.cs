using Application.Common.Behaviours;
using Application.Common.Interfaces;
using Application.Common.Services;
using Application.Security;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using Hangfire;
using Hangfire.SqlServer;
using System;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Builder;
using System.Threading;

namespace Application
{
  [ExcludeFromCodeCoverage]
  public static class DependencyInjection
  {
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration conf)
    {
      services.AddAutoMapper(Assembly.GetExecutingAssembly());
      services.AddMediatR(Assembly.GetExecutingAssembly());
      services.AddScoped<IPasswordHasher, PasswordHasher>();
      services.AddScoped<SynchronizeDebtorService>();
      services.AddScoped<StatsService>();

      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));

      services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage(conf.GetConnectionString("DefaultConnection"), new SqlServerStorageOptions
        {
          CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
          SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
          QueuePollInterval = TimeSpan.Zero,
          UseRecommendedIsolationLevel = true,
          DisableGlobalLocks = true
        }));

      services.AddHangfireServer();

      return services;
    }


    public static IApplicationBuilder AddApplication(this IApplicationBuilder app, IRecurringJobManager jobs)
    {
      app.UseHangfireDashboard();
      app.UseEndpoints(endpoints =>
     {
         endpoints.MapHangfireDashboard();
     });

      jobs.AddOrUpdate<RunListService>(
        "RunListService",
        o => o.SyncLocationsToRefills(CancellationToken.None), "0 * * * *"
      );

      return app;
    }
  }

}

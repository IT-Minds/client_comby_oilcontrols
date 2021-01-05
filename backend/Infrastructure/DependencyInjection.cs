using Application.Common.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Diagnostics.CodeAnalysis;

namespace Infrastructure
{
  [ExcludeFromCodeCoverage]
  public static class DependencyInjection
  {
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
    {

      //
      if (!environment.IsEnvironment("Test"))
      {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetService<ApplicationDbContext>());

        services.AddTransient<IDateTimeOffsetService, DateTimeOffsetService>();
      }


      //TODO Add needed authentication here
      // services.AddAuthentication(options => {
      //     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      // })
      // .AddJwtBearer(options => {
      //     ///
      // });

      return services;
    }
  }
}

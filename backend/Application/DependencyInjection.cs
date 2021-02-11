using Application.Common.Behaviours;
using Application.Common.Interfaces;
using Application.Common.Services;
using Application.Security;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace Application
{
  [ExcludeFromCodeCoverage]
  public static class DependencyInjection
  {
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
      services.AddAutoMapper(Assembly.GetExecutingAssembly());
      services.AddMediatR(Assembly.GetExecutingAssembly());
      services.AddScoped<IPasswordHasher, PasswordHasher>();
      services.AddScoped<SyncroniceDebtorService>();
      services.AddScoped<StatsService>();

      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
      return services;
    }
  }
}

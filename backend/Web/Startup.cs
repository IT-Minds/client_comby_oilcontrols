using Application;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Hubs;
using FluentValidation.AspNetCore;
using Infrastructure;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NSwag;
using NSwag.Generation.Processors.Security;
using Serilog;
using System.Linq;
using Web.Filters;
using Web.Hubs;
using Application.Common.Options;
using Web.Services;
using Infrastructure.Options;
using Web.Options;
using Microsoft.Extensions.Options;

namespace Web
{
  public class Startup
  {
    public Startup(IConfiguration configuration, IWebHostEnvironment environment)
    {
      Configuration = configuration;
      Environment = environment;
    }

    public IConfiguration Configuration { get; }

    public IWebHostEnvironment Environment { get; }
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {

      services.AddCors(options =>
      {
        options.AddPolicy("AllowAll",
                  builder =>
                  {
                    builder.AllowAnyOrigin();
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                  });
      });

      services.Configure<FileDriveOptions>(Configuration.GetSection(FileDriveOptions.FileDrive));
      services.Configure<UniContaOptions>(Configuration.GetSection(UniContaOptions.UniConta));
      services.Configure<SeedOptions>(Configuration.GetSection(SeedOptions.SampleData));

      services.Configure<TokenOptions>(Configuration.GetSection(TokenOptions.Tokens));
      services.AddApplication();
      services.AddInfrastructure(Configuration, Environment);



      services.AddHttpContextAccessor();

      services.AddHealthChecks()
          .AddDbContextCheck<ApplicationDbContext>();

      services.AddControllers(options =>
                 options.Filters.Add<ApiExceptionFilterAttribute>())
          .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<IApplicationDbContext>())
          .AddNewtonsoftJson();

      // Customise default API behaviour
      services.Configure<ApiBehaviorOptions>(options =>
      {
        options.SuppressModelStateInvalidFilter = true;
      });

      services.AddOpenApiDocument(configure =>
      {
        configure.Title = "Backend API";
        configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
        {
          Type = OpenApiSecuritySchemeType.ApiKey,
          Name = "Authorization",
          In = OpenApiSecurityApiKeyLocation.Header,
          Description = "Bearer {your JWT token}."
        });

        configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
      });

      services.AddScoped<ICurrentUserService, CurrentUserService>();
      services.AddScoped<IAuthorizationService, AuthorizationService>();
      services.AddScoped<IExampleHubService, ExampleHubService>();
      services.AddScoped<ITokenService, TokenService>();
      services.AddSignalR();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ApplicationDbContext context, IOptions<SeedOptions> seedOptions)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      using (context)
      {
        context.Database.AutoTransactionsEnabled = true;
        var transaction = context.Database.BeginTransaction();
        transaction?.CreateSavepoint("PRE_MIGRATION");
        try
        {
          context.Database.Migrate();
        }
        catch
        {
          transaction?.RollbackToSavepoint("PRE_MIGRATION");
        }
        transaction?.CreateSavepoint("POST_MIGRATION");
        if (env.IsDevelopment() && !env.IsEnvironment("Test") && seedOptions.Value.SeedSampleData)
        {
        transaction = context.Database.CurrentTransaction;
        context.Database.Migrate();
        transaction?.Commit();
        if (env.IsDevelopment() && env.IsEnvironment("Test") && seedOptions.Value.SeedSampleData)
          new SampleData().SeedSampleData(context);
        }
        transaction?.Commit();
      }

      //TODO Handle cors
      app.UseCors("AllowAll");

      app.UseSerilogRequestLogging();
      app.UseHealthChecks("/health");
      app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseSwaggerUi3(settings =>
      {
        settings.Path = "/swagger";
        settings.DocumentPath = "/swagger/specification.json";
      });

      app.UseRouting();

      //TODO add auth.
      // app.UseAuthentication();
      // app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
                  name: "default",
                  pattern: "{controller}/{action=Index}/{id?}");

        endpoints.MapHub<ExampleHub>("/examplehub");
      });
    }
  }
}

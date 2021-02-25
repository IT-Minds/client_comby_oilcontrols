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
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Domain.Entities;
using Application.Security;
using Hangfire;

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
      services.Configure<FileDriveOptions>(Configuration.GetSection(FileDriveOptions.FileDrive));
      services.Configure<UniContaOptions>(Configuration.GetSection(UniContaOptions.UniConta));
      services.Configure<SeedOptions>(Configuration.GetSection(SeedOptions.SampleData));
      services.Configure<HashingOptions>(Configuration.GetSection(HashingOptions.Hashing));
      services.Configure<TokenOptions>(Configuration.GetSection(TokenOptions.Tokens));
      services.Configure<SuperUserOptions>(Configuration.GetSection(SuperUserOptions.SuperUser));


      var corsOptions = Configuration.GetSection(CorsOptions.Cors).Get<CorsOptions>();
      System.Console.WriteLine("Cors Policy " + string.Join(",", corsOptions.Origins));
      services.AddCors(options =>
      {
        options.AddPolicy("CombyPolicy",
          builder =>
          {
            builder.WithOrigins(corsOptions.Origins);
            builder.AllowAnyHeader();
            builder.AllowAnyMethod();
            builder.AllowCredentials();
          });
      });

      services.AddApplication(Configuration);
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
          Description = "In the value box below write: \"Bearer {your JWT token}\"."
        });

        configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
      });

      services.AddScoped<SuperAdminService>();
      services.AddScoped<ICurrentUserService, CurrentUserService>();
      services.AddScoped<IAuthorizationService, AuthorizationService>();
      services.AddScoped<IExampleHubService, ExampleHubService>();
      services.AddScoped<ITokenService, TokenService>();
      services.AddSignalR();

      var key = Encoding.ASCII.GetBytes(Configuration.GetSection(TokenOptions.Tokens)
        .GetChildren().FirstOrDefault(x => x.Key.Equals("Secret")).Value);

      services.AddAuthentication(x =>
      {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
      .AddJwtBearer(x =>
      {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(key),
          ValidateIssuer = false,
          ValidateAudience = false
        };
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ApplicationDbContext context, IOptions<SeedOptions> seedOptions,  SuperAdminService superAdminService, IRecurringJobManager backgroundJobs)
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
        context.Database.AutoTransactionsEnabled = false;
        context.Database.Migrate();

        if (env.IsDevelopment() && !env.IsEnvironment("Test") && seedOptions.Value.SeedSampleData)
        {
          SampleData.SeedSampleData(context);
        }

        superAdminService.SetupSuperUser();
      }

      app.UseCors("CombyPolicy");

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

      app.UseHangfireDashboard();

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
                  name: "default",
                  pattern: "{controller}/{action=Index}/{id?}");

        endpoints.MapHub<ExampleHub>("/examplehub");
        endpoints.MapHangfireDashboard("/jobs");
      });

      app.AddApplication(backgroundJobs);
    }
  }
}

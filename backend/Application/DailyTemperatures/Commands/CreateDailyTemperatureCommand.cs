using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace Application.DailyTemperatures.Commands.CreateDailyTemperature
{
  public class CreateDailyTemperatureCommand : IRequest<int>
  {
    public int RegionId { get; set; }
    public DateTime Date { get; set; }
    public double Temperature { get; set; }

    public class CreateDailyTemperatureCommandHandler : IRequestHandler<CreateDailyTemperatureCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateDailyTemperatureCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(CreateDailyTemperatureCommand request, CancellationToken cancellationToken)
      {
        var region = _context.Regions.FirstOrDefault(x => x.Id == request.RegionId);
        if (region == null)
        {
          throw new ArgumentException("Invalid Region ID: " + request.RegionId);
        }
        var dailyTemp = new RegionDailyTemp
        {
          RegionId = request.RegionId,
          Date = request.Date,
          Temperature = request.Temperature
        };

        _context.RegionDailyTemps.Add(dailyTemp);

        await _context.SaveChangesAsync(cancellationToken);
        return dailyTemp.Id;
      }
    }
  }
}
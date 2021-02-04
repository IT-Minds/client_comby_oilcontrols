using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Application.Common.Security;

namespace Application.DailyTemperatures.Commands.CreateDailyTemperature
{
  [AuthorizeAttribute(Domain.Enums.Action.SET_TEMPERATURE)]
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
        var region = _context.Regions
          .Include(x => x.DailyTemperatures)
          .FirstOrDefault(x => x.Id == request.RegionId);
        if (region == null)
        {
          throw new ArgumentException("Invalid Region ID: " + request.RegionId);
        }

        var temp = region.DailyTemperatures.FirstOrDefault(x => x.Date == request.Date);
        if (temp != null)
        {
          throw new ArgumentException("Temperature allready registered for the: " + request.Date);
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
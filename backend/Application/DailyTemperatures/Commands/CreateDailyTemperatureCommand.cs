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
using AutoMapper;

namespace Application.DailyTemperatures.Commands.CreateDailyTemperature
{
  [AuthorizeAttribute(Domain.Enums.Action.SET_TEMPERATURE)]
  public class CreateDailyTemperatureCommand : IRequest<TemperatureIdDto>
  {
    public TemperatureDto Dto { get; set; }

    public class CreateDailyTemperatureCommandHandler : IRequestHandler<CreateDailyTemperatureCommand, TemperatureIdDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly IMapper _mapper;

      public CreateDailyTemperatureCommandHandler(IApplicationDbContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<TemperatureIdDto> Handle(CreateDailyTemperatureCommand request, CancellationToken cancellationToken)
      {
        var region = _context.Regions
          .Include(x => x.DailyTemperatures)
          .FirstOrDefault(x => x.Id == request.Dto.RegionId);
        if (region == null)
        {
          throw new ArgumentException("Invalid Region ID: " + request.Dto.RegionId);
        }

        var temp = region.DailyTemperatures.FirstOrDefault(x => x.Date == request.Dto.Date);
        if (temp != null)
        {
          throw new ArgumentException("Temperature allready registered for the: " + request.Dto.Date);
        }

        var dailyTemp = new RegionDailyTemp
        {
          RegionId = request.Dto.RegionId,
          Date = request.Dto.Date,
          Temperature = request.Dto.Temperature
        };

        _context.RegionDailyTemps.Add(dailyTemp);

        await _context.SaveChangesAsync(cancellationToken);
        return _mapper.Map<TemperatureIdDto>(dailyTemp);
      }
    }
  }
}
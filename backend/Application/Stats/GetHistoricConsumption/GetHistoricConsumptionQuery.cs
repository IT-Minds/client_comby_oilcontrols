using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using CsvHelper;
using Application.Common.Services;
using System.Globalization;

namespace Application.Stats.GetHistoricConsumption
{
  public class GetHistoricConsumptionQuery : IRequest<IEnumerable<FuelConsumptionDto>>
  {
    public HistoricConsumptionDto Dto { get; set; }

    public class GetHistoricConsumptionQueryHandler : IRequestHandler<GetHistoricConsumptionQuery, IEnumerable<FuelConsumptionDto>>
    {
      private readonly StatsService _statsService;

      public GetHistoricConsumptionQueryHandler(StatsService statsService)
      {
        _statsService = statsService;
      }

      public async Task<IEnumerable<FuelConsumptionDto>> Handle(GetHistoricConsumptionQuery request, CancellationToken cancellationToken)
      {
        return await _statsService.ReportFuelConsumption(request.Dto.LocationId, request.Dto.Interval, request.Dto.StartDate, request.Dto.EndDate);
      }
    }
  }
}
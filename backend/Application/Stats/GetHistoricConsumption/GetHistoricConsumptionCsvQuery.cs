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
using Application.Common.Security;

namespace Application.Stats.GetHistoricConsumption
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_LOCATION)]
  public class GetHistoricConsumptionCsvQuery : IRequest<FileResponseDto>
  {
    public HistoricConsumptionDto Dto { get; set; }

    public class GetHistoricConsumptionCsvQueryHandler : IRequestHandler<GetHistoricConsumptionCsvQuery, FileResponseDto>
    {
      private readonly StatsService _statsService;

      public GetHistoricConsumptionCsvQueryHandler(StatsService statsService)
      {
        _statsService = statsService;
      }

      public async Task<FileResponseDto> Handle(GetHistoricConsumptionCsvQuery request, CancellationToken cancellationToken)
      {
        var data = await _statsService.ReportFuelConsumption(request.Dto.LocationId, request.Dto.Interval, request.Dto.StartDate, request.Dto.EndDate);


        using (var memwriter = new MemoryStream())
        using (var writer = new StreamWriter(memwriter, System.Text.Encoding.UTF8))
        using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
        {

          csv.WriteRecords(data);
          writer.Flush();

          return new FileResponseDto
          {
            Stream = memwriter.ToArray(),
            Filename = request.Dto.LocationId + "-" + request.Dto.StartDate + "-" + request.Dto.EndDate + "-" + request.Dto.Interval + ".csv"
          };
        }
      }
    }
  }
}
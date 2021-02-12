using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Services;
using CsvHelper;
using MediatR;

namespace Application.Stats.GetRefillOfYear
{
  public class GetRefillOfYearQuery : IRequest<FileReponseDto>
  {
    public int Year { get; set; }

    public class GetRefillOfYearQueryHandler : IRequestHandler<GetRefillOfYearQuery, FileReponseDto>
    {

      private readonly StatsService _statsService;

      public GetRefillOfYearQueryHandler(StatsService statsService)
      {
        _statsService = statsService;
      }

      public async Task<FileReponseDto> Handle(GetRefillOfYearQuery request, CancellationToken cancellationToken)
      {
        var data = await _statsService.ReportRefillsOfYear(request.Year);

        using (var memwriter = new MemoryStream())
        using (var writer = new StreamWriter(memwriter))
        using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
        {

          csv.WriteRecords(data.ToList());
          writer.Flush();

          return new FileReponseDto
          {
            Stream = memwriter.ToArray(),
            Filename = "refill-" + request.Year + ".csv"
          };
        }
      }
    }
  }
}

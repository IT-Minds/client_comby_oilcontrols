using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Security;
using Application.Common.Services;
using CsvHelper;
using MediatR;

namespace Application.Stats.GetRefillOfYear
{
  [AuthorizeAttribute(Domain.Enums.Action.GET_REFILLS)]
  public class GetRefillOfYearQuery : IRequest<FileResponseDto>
  {
    public int Year { get; set; }

    public class GetRefillOfYearQueryHandler : IRequestHandler<GetRefillOfYearQuery, FileResponseDto>
    {

      private readonly StatsService _statsService;

      public GetRefillOfYearQueryHandler(StatsService statsService)
      {
        _statsService = statsService;
      }

      public async Task<FileResponseDto> Handle(GetRefillOfYearQuery request, CancellationToken cancellationToken)
      {
        var data = await _statsService.ReportRefillsOfYear(request.Year);

        using (var memwriter = new MemoryStream())
        using (var writer = new StreamWriter(memwriter))
        using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
        {

          csv.WriteRecords(data.ToList());
          writer.Flush();

          return new FileResponseDto
          {
            Stream = memwriter.ToArray(),
            Filename = "refill-" + request.Year + ".csv"
          };
        }
      }
    }
  }
}

using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Options;
using MediatR;
using Microsoft.Extensions.Options;

namespace Application.Locations.Queries.GetLocationImage
{
  public class GetLocationImageQuery : IRequest<List<ImageResponseDto>>
  {
    public int LocationdId { get; set; }

    public class GetLocationImageQueryHandler : IRequestHandler<GetLocationImageQuery, List<ImageResponseDto>>
    {
      private readonly IApplicationDbContext _context;
      private readonly FileDriveOptions _options;

      public GetLocationImageQueryHandler(IApplicationDbContext context, IOptions<FileDriveOptions> options)
      {
        _context = context;
        _options = options.Value;
      }

      public async Task<List<ImageResponseDto>> Handle(GetLocationImageQuery request, CancellationToken cancellationToken)
      {
        var location = await _context.Locations.FindAsync(request.LocationdId);
        if (location == null)
        {
          throw new NotFoundException("No location with ID: " + request.LocationdId);
        }

        var files = Directory.EnumerateFiles(_options.CouponPath, request.LocationdId + ".*");

        var result = new List<ImageResponseDto>();
        foreach (var file in files)
        {
          using (Stream fileStream = new FileStream(file, FileMode.Open))
          {
            var dto = new ImageResponseDto
            {
              LocationId = location.Id
            };
            dto.Stream = new byte[fileStream.Length];
            await fileStream.ReadAsync(dto.Stream);
            result.Add(dto);
          }
        }

        return result;
      }
    }
  }
}
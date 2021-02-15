using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Options;
using MediatR;
using Microsoft.Extensions.Options;

namespace Application.Coupons.Queries.GetCouponImage
{
  public class GetCouponImageQuery : IRequest<List<ImageResponseDto>>
  {
    public int RefillId { get; set; }

    public class GetCouponsImageQueryHandler : IRequestHandler<GetCouponImageQuery, List<ImageResponseDto>>
    {
      private readonly IApplicationDbContext _context;
      private readonly FileDriveOptions _options;

      public GetCouponsImageQueryHandler(IApplicationDbContext context, IOptions<FileDriveOptions> options)
      {
        _context = context;
        _options = options.Value;
      }
      public async Task<List<ImageResponseDto>> Handle(GetCouponImageQuery request, CancellationToken cancellationToken)
      {
        var refill = await _context.AssignedRefills.FindAsync(request.RefillId);
        if (refill == null)
        {
          throw new NotFoundException("No refill with ID: " + request.RefillId);
        }

        var files = Directory.EnumerateFiles(_options.CouponPath, request.RefillId + ".*");

        var result = new List<ImageResponseDto>();
        foreach (var file in files)
        {
          using (Stream fileStream = new FileStream(file, FileMode.Open))
          {
            var dto = new ImageResponseDto
            {
              RefillId = refill.Id
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
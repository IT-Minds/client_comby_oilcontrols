using Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using Application.Common.Options;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Exceptions;
using Application.Common.Security;

namespace Application.Coupons.Commands.SaveCouponImage
{
  [AuthorizeAttribute(Domain.Enums.Action.SAVE_COUPON_IMAGE)]
  public class SaveCouponImageCommand : IRequest<CouponImageInfoDto>
  {
    public CouponImageDto Dto { get; set; }

    public class SaveCouponImageCommandHandler : IRequestHandler<SaveCouponImageCommand, CouponImageInfoDto>
    {
      private readonly IApplicationDbContext _context;
      private readonly FileDriveOptions _options;

      public SaveCouponImageCommandHandler(IApplicationDbContext context, IOptions<FileDriveOptions> options)
      {
        _context = context;
        _options = options.Value;
      }


      public async Task<CouponImageInfoDto> Handle(SaveCouponImageCommand request, CancellationToken cancellationToken)
      {
        var refill = await _context.AssignedRefills.FindAsync(request.Dto.RefillId);
        if (refill == null)
        {
          throw new NotFoundException("No refill with ID: " + request.Dto.RefillId);
        }

        string imgType = request.Dto.File.ContentType.Substring(6);
        var filename = request.Dto.RefillId + "." + imgType;
        string filePath = Path.Combine(_options.CouponPath, filename);

        if (System.IO.File.Exists(filePath))
        {
          throw new ArgumentException("Image with " + request.Dto.RefillId + " already exists.");
        }

        using (Stream fileStream = new FileStream(filePath, FileMode.Create))
        {
          await request.Dto.File.CopyToAsync(fileStream);
        }

        return new CouponImageInfoDto
        {
          RefillId = refill.Id,
          Path = filePath
        };
      }
    }
  }
}

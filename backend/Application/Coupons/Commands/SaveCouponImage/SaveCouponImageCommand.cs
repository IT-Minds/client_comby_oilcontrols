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
  public class SaveCouponImageCommand : IRequest<string>
  {
    public int RefillId { get; set; }
    public IFormFile File { get; set; }

    public class SaveCouponImageCommandHandler : IRequestHandler<SaveCouponImageCommand, string>
    {
      private readonly IApplicationDbContext _context;
      private readonly FileDriveOptions _options;

      public SaveCouponImageCommandHandler(IApplicationDbContext context, IOptions<FileDriveOptions> options)
      {
        _context = context;
        _options = options.Value;
      }


      public async Task<string> Handle(SaveCouponImageCommand request, CancellationToken cancellationToken)
      {
        var refill = await _context.AssignedRefills.FindAsync(request.RefillId);
        if (refill == null)
        {
          throw new NotFoundException("No refill with ID: " + request.RefillId);
        }

        string imgType = request.File.ContentType.Substring(6);
        var filename = request.RefillId + "." + imgType;
        string filePath = Path.Combine(_options.CouponPath, filename);

        if (System.IO.File.Exists(filePath))
        {
          throw new ArgumentException("Image with " + request.RefillId + " already exists.");
        }

        using (Stream fileStream = new FileStream(filePath, FileMode.Create))
        {
          await request.File.CopyToAsync(fileStream);
        }
        return filename;
      }
    }
  }
}

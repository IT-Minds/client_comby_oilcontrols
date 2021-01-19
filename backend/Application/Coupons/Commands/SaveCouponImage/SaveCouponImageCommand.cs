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

namespace Application.Coupons.Commands.SaveCouponImage
{
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
        var refill = await _context.Refills.FindAsync(request.RefillId);
        if (refill == null)
        {
          throw new NotFoundException("No refill with ID: " + request.RefillId);
        }

        String imgType;
        Regex type = new Regex(@"(^image\/png$)|(^image\/webp$)");
        if (!type.IsMatch(request.File.ContentType))
        {
          throw new ArgumentException("Invalid content type.");
        }

        imgType = request.File.ContentType.Substring(6);
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

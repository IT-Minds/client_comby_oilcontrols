using Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Coupons.Commands.SaveCouponImage
{
  public class SaveCouponImageCommand : IRequest<string>
  {
    public int RefillId { get; set; }
    public IFormFile File { get; set; }


    public class SaveCouponImageCommandHandler : IRequestHandler<SaveCouponImageCommand, string>
    {
      private readonly IApplicationDbContext _context;
      public SaveCouponImageCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<string> Handle(SaveCouponImageCommand request, CancellationToken cancellationToken)
      {
        var refill = _context.Refills.Where(x => x.Id == request.RefillId);
        if(refill.Count() == 0){
          throw new ArgumentException("No refill with ID: "+request.RefillId);
        }
        String imgType;
        Regex png = new Regex(@"image/png");
        Regex webp = new Regex(@"image/webp");

        if(png.IsMatch(request.File.ContentType)){
          imgType = "png";
        }
        else if (webp.IsMatch(request.File.ContentType)){
          imgType = "webp";
        } else {
          throw new ArgumentException("Invalid content type.");
        }

        var folderpath = System.Environment.GetEnvironmentVariable("COUPON_PATH");
        var filename = request.RefillId+"."+imgType;       
        string filePath = Path.Combine(folderpath, filename);
        
        if(System.IO.File.Exists(filePath)){
          throw new ArgumentException("Image with "+request.RefillId+" already exists.");
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
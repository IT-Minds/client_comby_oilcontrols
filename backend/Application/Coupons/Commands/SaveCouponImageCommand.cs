using Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Coupons.Commands.SaveCouponImage
{
  public class SaveCouponImageCommand : IRequest<string>
  {
    public string FileName { get; set; }
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
        var path = System.Environment.GetEnvironmentVariable("COUPON_PATH");
        string filePath = Path.Combine(path, request.FileName);
        if(System.IO.File.Exists(filePath)){
          throw new ArgumentException("Image with "+request.FileName+" already exists.");
        }
        
        using (Stream fileStream = new FileStream(filePath, FileMode.Create))
        {
          await request.File.CopyToAsync(fileStream);
        }
        return request.FileName;
      }
    }
  }
}
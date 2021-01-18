using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Application.Common.Exceptions;
using Microsoft.AspNetCore.Http;
using System;
using System.Text.RegularExpressions;
using System.IO;
using Application.Common.Options;
using Microsoft.Extensions.Options;

namespace Application.Locations.Commands.AddLocationImageCommand
{
  public class AddLocationImageCommand : IRequest<string>
  {
    public int LocationId { get; set; }
    public IFormFile Picture { get; set; }


    public class AddLocationImageCommandHandler : IRequestHandler<AddLocationImageCommand, string>
    {
      private readonly IApplicationDbContext _context;
      private readonly FileDriveOptions _options;

      public AddLocationImageCommandHandler(IApplicationDbContext context, IOptions<FileDriveOptions> options)
      {
        _context = context;
        _options = options?.Value;
      }

      public async Task<string> Handle(AddLocationImageCommand request, CancellationToken cancellationToken)
      {
        var refill = await _context.Locations.FindAsync(request.LocationId);
        if (refill == null)
        {
          throw new ArgumentException("No location with ID: " + request.LocationId);
        }

        String imgType;
        Regex png = new Regex(@"^image\/png$");
        Regex webp = new Regex(@"^image\/webp$");

        if (png.IsMatch(request.Picture.ContentType))
        {
          imgType = "png";
        }
        else if (webp.IsMatch(request.Picture.ContentType))
        {
          imgType = "webp";
        }
        else
        {
          throw new ArgumentException("Invalid content type.");
        }
        var filename = request.LocationId + "." + imgType;
        string filePath = Path.Combine(_options.Path, filename);

        if (System.IO.File.Exists(filePath))
        {
          throw new ArgumentException("Image with " + request.LocationId + " already exists.");
        }

        using (Stream fileStream = new FileStream(filePath, FileMode.Create))
        {
          await request.Picture.CopyToAsync(fileStream);
        }

        return filename;
      }
    }
  }
}
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
using Application.Common.Security;

namespace Application.Locations.Commands.AddLocationImage
{
  [AuthorizeAttribute(Domain.Enums.Action.UPDATE_LOCATION)]
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
        _options = options.Value;
      }

      public async Task<string> Handle(AddLocationImageCommand request, CancellationToken cancellationToken)
      {
        var location = await _context.Locations.FindAsync(request.LocationId);
        if (location == null)
        {
          throw new NotFoundException("No location with ID: " + request.LocationId);
        }

        String imgType;
        Regex type = new Regex(@"(^image\/png$)|(^image\/webp$)");

        if (!type.IsMatch(request.Picture.ContentType))
        {
          throw new ArgumentException("Invalid content type.");
        }
        imgType = request.Picture.ContentType.Substring(6);

        var filename = request.LocationId + "." + imgType;
        string filePath = Path.Combine(_options.LocationPath, filename);

        try
        {
          using (Stream fileStream = new FileStream(filePath, FileMode.Create))
          {
            await request.Picture.CopyToAsync(fileStream, cancellationToken);
          }
        }
        catch
        {
          throw new ForbiddenAccessException();
        }

        location.HasImage = true;
        _context.Locations.Update(location);
        await _context.SaveChangesAsync(cancellationToken);

        return filename;
      }
    }
  }
}

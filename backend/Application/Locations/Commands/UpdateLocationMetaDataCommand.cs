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

namespace Application.Locations.Commands.UpdateLocationMetaData
{
  public class UpdateLocationMetaDataCommand : IRequest<int>
  {
    public int LocationId { get; set; }
    public string Address { get; set; }
    public string Comment { get; set; }
    public RefillSchedule Refillschedule { get; set; }
    public TankType TankType { get; set; }
    public int TankNumber { get; set; }
    public double TankCapacity { get; set; }
    public double MinimumFuelAmount { get; set; }
    //TODO Estiamte consumption isn't currently in the data model, but this is also a calculated property right?
    public double EstimateConsumption { get; set; }
    public IFormFile Picture { get; set; }

    public class UpdateLocationMetaDataCommandHandler : IRequestHandler<UpdateLocationMetaDataCommand, int>
    {
      private readonly IApplicationDbContext _context;
      private readonly FileDriveOptions _options;

      public UpdateLocationMetaDataCommandHandler(IApplicationDbContext context, IOptions<FileDriveOptions> options)
      {
        _context = context;
        _options = options?.Value;
      }

      public async Task<int> Handle(UpdateLocationMetaDataCommand request, CancellationToken cancellationToken)
      {
        var location = await _context.Locations
          .Include(x => x.FuelTank)
          .FirstOrDefaultAsync(x => x.Id == request.LocationId);

        if (location == null)
        {
          throw new NotFoundException(nameof(location), request.LocationId);
        }

        location.Address = request.Address;
        location.Comments = request.Comment;
        location.Schedule = request.Refillschedule;

        var tank = location.FuelTank;
        tank.TankCapacity = request.TankCapacity;
        tank.MinimumFuelAmount = request.MinimumFuelAmount;

        if (request.Picture != null)
        {
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
        }


        await _context.SaveChangesAsync(cancellationToken);
        return request.LocationId;
      }
    }
  }
}
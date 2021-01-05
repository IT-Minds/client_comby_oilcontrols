using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.ExampleEntities.Commands.UpdateExampleEntity
{
  public class UpdateExampleEntityCommand : IRequest
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public ExampleEnum ExampleEnum { get; set; }
    public int? ExampleEntityListId { get; set; }


    public class UpdateExampleEntityCommandHandler : IRequestHandler<UpdateExampleEntityCommand>
    {
      private readonly IApplicationDbContext _context;

      public UpdateExampleEntityCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<Unit> Handle(UpdateExampleEntityCommand request, CancellationToken cancellationToken)
      {
        var exampleEntity = await _context.ExampleEntities.FindAsync(request.Id);

        if (exampleEntity == null)
        {
          throw new NotFoundException(nameof(ExampleEntity), request.Id);
        }

        exampleEntity.ExampleEntityListId = request.ExampleEntityListId;

        if (request.ExampleEntityListId.HasValue &&
            !await _context.ExampleEntityLists.AnyAsync(e => e.Id == request.ExampleEntityListId.Value, cancellationToken))
        {
          throw new NotFoundException(nameof(ExampleEntityList), request.ExampleEntityListId.Value);
        }

        exampleEntity.Name = request.Name;
        exampleEntity.ExampleEnum = request.ExampleEnum;

        _context.ExampleEntities.Update(exampleEntity);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
      }
    }
  }
}

using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.ExampleEntities.Commands.DeleteExampleEntity
{
  public class DeleteExampleEntityCommand : IRequest
  {
    public int Id { get; set; }

    public class DeleteExampleEntityCommandHandler : IRequestHandler<DeleteExampleEntityCommand>
    {
      private readonly IApplicationDbContext _context;

      public DeleteExampleEntityCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }
      public async Task<Unit> Handle(DeleteExampleEntityCommand request, CancellationToken cancellationToken)
      {
        var exampleEntity = await _context.ExampleEntities.FindAsync(request.Id);

        if (exampleEntity == null)
        {
          throw new NotFoundException(nameof(ExampleEntity), request.Id);
        }

        _context.ExampleEntities.Remove(exampleEntity);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
      }
    }
  }
}

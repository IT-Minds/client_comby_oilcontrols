using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.ExampleEntities.Commands.CreateExampleEntity
{
  public class CreateExampleEntityCommand : IRequest<int>
  {
    public string Name { get; set; }
    public ExampleEnum ExampleEnum { get; set; }

    public class CreateExampleEntityCommandHandler : IRequestHandler<CreateExampleEntityCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateExampleEntityCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }

      public async Task<int> Handle(CreateExampleEntityCommand request, CancellationToken cancellationToken)
      {
        var exampleEntity = new ExampleEntity
        {
          ExampleEnum = request.ExampleEnum,
          Name = request.Name
        };

        _context.ExampleEntities.Add(exampleEntity);

        await _context.SaveChangesAsync(cancellationToken);

        return exampleEntity.Id;
      }
    }
  }
}

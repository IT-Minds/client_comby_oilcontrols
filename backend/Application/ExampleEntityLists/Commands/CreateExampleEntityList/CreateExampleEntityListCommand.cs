using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Application.ExampleEntityLists.Commands.CreateExampleEntityList
{
  public class CreateExampleEntityListCommand : IRequest<int>
  {
    public string Name { get; set; }


    public class CreateExampleEntityListCommandHandler : IRequestHandler<CreateExampleEntityListCommand, int>
    {
      private readonly IApplicationDbContext _context;

      public CreateExampleEntityListCommandHandler(IApplicationDbContext context)
      {
        _context = context;
      }
      public async Task<int> Handle(CreateExampleEntityListCommand request, CancellationToken cancellationToken)
      {

        var exampleEntityList = new ExampleEntityList
        {
          Name = request.Name
        };

        _context.ExampleEntityLists.Add(exampleEntityList);

        await _context.SaveChangesAsync(cancellationToken);

        return exampleEntityList.Id;
      }
    }
  }
}

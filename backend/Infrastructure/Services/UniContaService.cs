using System;
using System.Threading.Tasks;
using Uniconta.API.Service;
using Uniconta.Common;
using Uniconta.Common.User;
using Uniconta.API.System;
using System.Collections.Generic;
using System.Linq;
using Infrastructure.Options;
using Microsoft.Extensions.Options;
using Application.Common.Interfaces;
using Uniconta.DataModel;
using UniContaDomain.Entities;

namespace Infrastructure.Services
{
  public class UniContaService: IUniContaService
  {
    private UnicontaConnection connection { get; set; }
    private Session session { get; set; }
    private Company defaultCompany { get; set; }
    private readonly UniContaOptions _options;

    public UniContaService(IOptions<UniContaOptions> options)
    {
      _options = options.Value;
    }

    public async Task<bool> Login()
    {
      connection = new UnicontaConnection(APITarget.Live);
      session = new Session(connection);
      var loginResult = await session.LoginAsync(_options.ApiUser, _options.ApiPass, LoginType.API, new Guid(_options.ApiGuid));

      if (loginResult != ErrorCodes.Succes) return false;

      await InitializeCompany();
      return true;
    }

    public async Task<IEnumerable<UniContaDebtor>> GetDebtors()
    {
      var api = new CrudAPI(session, defaultCompany);
      var debtors = await api.Query<Uniconta.DataModel.Debtor>();
      return debtors.Select(x => new UniContaDebtor(x) );
    }

    private async Task InitializeCompany()
    {
      // If Session has a default company, use DefaultCompany as CurrentCompany
      if (session.DefaultCompany != null)
      {
          defaultCompany = session.DefaultCompany;
          return;
      }

      //todo makes into config option
      defaultCompany = await session.OpenCompany(45182, true);
    }

    public async Task<bool> CreateOrder(UniContaOrder order)
    {
      var api = new CrudAPI(session, defaultCompany);

      var result = await api.Insert(
        order
      );

      if (result != ErrorCodes.Succes) return false;

      return true;
    }
  }
}

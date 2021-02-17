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
using System.IO;

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

      System.Console.Write("UniConta login: " + loginResult);

      if (loginResult != ErrorCodes.Succes) return false;

      await InitializeCompany();
      return true;
    }

    public async Task<IEnumerable<UniContaDebtor>> GetDebtors()
    {
      System.Console.WriteLine("UniConta Debtors Fetching... ");
      var api = new CrudAPI(session, defaultCompany);

      var debtorsCached = await api.LoadCache<Uniconta.DataModel.Debtor>();
      System.Console.WriteLine("UniConta Debtors Cached: " + debtorsCached.Count());

      var debtors = await api.Query<Uniconta.DataModel.Debtor>();
      System.Console.WriteLine("UniConta Debtors: " + debtors.Count());

      return debtors.Select(x => new UniContaDebtor(x) );
    }

    public async Task<UniContaDebtor> GetDebtor(int id)
    {
      var api = new CrudAPI(session, defaultCompany);

      var debtor = new Uniconta.DataModel.Debtor { RowId = id };
      await api.Read(debtor);

      return new UniContaDebtor(debtor);
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
      defaultCompany = await session.GetCompany(45182);
    }

    public async Task<(int OrderId, int OrderLineId)> CreateOrder(UniContaOrder inputOrder)
    {
      var api = new CrudAPI(session, defaultCompany);

      var debtor = await GetDebtor(inputOrder.DebtorId);

      var order = new Uniconta.ClientTools.DataModel.DebtorOrderClient
      {
        _DCAccount = debtor.AccountNumber,
        CompanyId = 45182
      };

      try
      {
        // ! NOTE: Not all refills have an image - we wrap in try catch for system error prevention should there not be one.
        var bytes = await File.ReadAllBytesAsync(@"wwwroot\debugImages\coupons\" + inputOrder.CouponId + ".png");
        var vc = new Uniconta.ClientTools.DataModel.UserDocsClient
        {
          _Data = bytes,
          _DocumentType = FileextensionsTypes.PNG,
        };
        await api.Insert(vc);

        order.DocumentRef = vc.RowId;
      } catch(Exception e) {
        System.Console.WriteLine("No image!");
        System.Console.WriteLine(e.Message);
      }

      var result = await api.Insert(order);
      System.Console.WriteLine("Order Code: " + result);

      var orderLine = new DebtorOrderLineUser
      {
        Item = inputOrder.ProductId,
        Qty = inputOrder.AmountFilled,
        Date = inputOrder.Date,
        Text = "Automatisk oprettet efter påfyldning",
        fltbygnr = inputOrder.BuildingId,
        fltkuponnr = inputOrder.CouponNumber,
        OrderNumber = order.RowId.ToString()
      };

      result = await api.Insert(orderLine);
      System.Console.WriteLine("Order Line Code: " + result);

      return (order.RowId, orderLine.RowId);
    }
  }
}

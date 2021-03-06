using System;

namespace UniContaDomain.Entities
{
  public class UniContaOrder
  {
    public int DebtorId;
    public string BuildingId;
    public string ProductId;
    public double AmountFilled;
    public DateTime Date;
    public string CouponNumber;
    public int CouponId;
  }

  public class DebtorOrderLineUser : Uniconta.ClientTools.DataModel.DebtorOrderLineClient
  {
    public string fltbygnr
    {
      get { return this.GetUserFieldString(0); }

      set { this.SetUserFieldString(0, value); }
    }

    public string fltkuponnr
    {

      get { return this.GetUserFieldString(1); }

      set { this.SetUserFieldString(1, value);  }
    }
  }
}

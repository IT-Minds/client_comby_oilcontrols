using System;

namespace UniContaDomain.Entities
{
  public class UniContaOrder
  {
    public string DebtorId;
    public string BuildingId;
    public string ProductId;
    public int AmountFilled;
    public DateTime Date;
    public string CouponNumber;
    public int CouponId;
  }

  public class DebtorOrderLineUser :  Uniconta.DataModel.DebtorOrderLine
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

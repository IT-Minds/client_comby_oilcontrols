namespace UniContaDomain.Entities
{
  public class UniContaDebtor
  {
    public int RowId {get; set;} // Unique key
    public bool Blocked {get; set;}
    public string AccountNumber {get; set;}
    public string Name {get; set;}
    public string GLN {get; set;}

    public UniContaDebtor(Uniconta.DataModel.Debtor debtor) {
      RowId = debtor.RowId;
      Blocked = debtor._Blocked;
      AccountNumber = debtor._Account;
      Name = debtor._Name;
      GLN = debtor._EAN;
    }
  }
}

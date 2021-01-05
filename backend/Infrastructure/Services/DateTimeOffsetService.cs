using Application.Common.Interfaces;
using System;

namespace Infrastructure.Services
{
  public class DateTimeOffsetService : IDateTimeOffsetService
  {
    public DateTimeOffset Now => DateTimeOffset.Now;
  }
}

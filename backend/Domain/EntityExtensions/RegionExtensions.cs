using System;
using System.Linq;
using Domain.Entities;

namespace Domain.EntityExtensions
{
  public static class RegionExtensions
  {
    public static double DailyTemperatureEstimate(this Region region, DateTime date)
    {
      var pastTemps = region.DailyTemperatures.Where(x => x.Date.Day == date.Day && x.Date.Month == date.Month && x.Date.Year < date.Year);
      if (pastTemps.Count() == 0)
      {
        throw new ArgumentException("No temperature entries before: " + date);
      }
      var avgTemp = pastTemps.Sum(x => x.Temperature) / pastTemps.Count();
      return avgTemp;
    }
  }
}
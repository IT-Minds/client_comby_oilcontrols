using Application.Common.Interfaces.Pagination;
using Application.Coupons.Queries.GetCoupons;
using Application.Coupons.Queries.GetCoupons.Truck;
using AutoMapper;
using Domain.Enums;
using FluentAssertions;
using Infrastructure.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace Application.UnitTests.Coupons.Queries.GetCoupons
{
  [Collection("QueryTests")]
  public class GetCouponsQueryTest
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetCouponsQueryTest(QueryTestFixture fixture)
    {
      _context = fixture.Context;
      _mapper = fixture.Mapper;
    }

    [Fact]
    public async Task Handle_ReturnsCorrectPageAndEntitiesCount()
    {
      var query = new GetCouponsTruckQuery
      {
        Size = 500,
        Needle = new System.DateTimeOffset(new System.DateTime(2019, 12, 31)),
        TruckId = 44
      };
      var handler = new GetCouponsTruckQuery.GetCouponsTruckQueryHandler(_context, _mapper);
      var result = await handler.Handle(query, CancellationToken.None);
      result.Should().BeOfType<PageResult<CouponIdDto, DateTimeOffset>>();
      result.Results.Count.Should().Be(2);
    }
  }
}

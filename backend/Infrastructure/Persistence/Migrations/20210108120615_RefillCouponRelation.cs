using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class RefillCouponRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CouponNumber",
                table: "Refills");

            migrationBuilder.AddColumn<int>(
                name: "CouponId",
                table: "Refills",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CouponNumber",
                table: "Coupons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Refills_CouponId",
                table: "Refills",
                column: "CouponId");

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_CouponNumber",
                table: "Coupons",
                column: "CouponNumber",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Refills_Coupons_CouponId",
                table: "Refills",
                column: "CouponId",
                principalTable: "Coupons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Refills_Coupons_CouponId",
                table: "Refills");

            migrationBuilder.DropIndex(
                name: "IX_Refills_CouponId",
                table: "Refills");

            migrationBuilder.DropIndex(
                name: "IX_Coupons_CouponNumber",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "CouponId",
                table: "Refills");

            migrationBuilder.DropColumn(
                name: "CouponNumber",
                table: "Coupons");

            migrationBuilder.AddColumn<int>(
                name: "CouponNumber",
                table: "Refills",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

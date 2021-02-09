using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class RefillSplitIntoMultipleEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Refills_Routes_RouteId",
                table: "Refills");

            migrationBuilder.DropForeignKey(
                name: "FK_Trucks_Routes_RouteId",
                table: "Trucks");

            migrationBuilder.DropTable(
                name: "Routes");

            migrationBuilder.DropIndex(
                name: "IX_Trucks_RouteId",
                table: "Trucks");

            migrationBuilder.DropIndex(
                name: "IX_Refills_CouponId",
                table: "Refills");

            migrationBuilder.DropColumn(
                name: "RouteId",
                table: "Trucks");

            migrationBuilder.RenameColumn(
                name: "RouteId",
                table: "Refills",
                newName: "TruckId");

            migrationBuilder.RenameIndex(
                name: "IX_Refills_RouteId",
                table: "Refills",
                newName: "IX_Refills_TruckId");

            migrationBuilder.AddColumn<int>(
                name: "RefillState",
                table: "Refills",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RefillId",
                table: "Coupons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Refills_CouponId",
                table: "Refills",
                column: "CouponId",
                unique: true,
                filter: "[CouponId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Refills_Trucks_TruckId",
                table: "Refills",
                column: "TruckId",
                principalTable: "Trucks",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Refills_Trucks_TruckId",
                table: "Refills");

            migrationBuilder.DropIndex(
                name: "IX_Refills_CouponId",
                table: "Refills");

            migrationBuilder.DropColumn(
                name: "RefillState",
                table: "Refills");

            migrationBuilder.DropColumn(
                name: "RefillId",
                table: "Coupons");

            migrationBuilder.RenameColumn(
                name: "TruckId",
                table: "Refills",
                newName: "RouteId");

            migrationBuilder.RenameIndex(
                name: "IX_Refills_TruckId",
                table: "Refills",
                newName: "IX_Refills_RouteId");

            migrationBuilder.AddColumn<int>(
                name: "RouteId",
                table: "Trucks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trucks_RouteId",
                table: "Trucks",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_Refills_CouponId",
                table: "Refills",
                column: "CouponId");

            migrationBuilder.AddForeignKey(
                name: "FK_Refills_Routes_RouteId",
                table: "Refills",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Trucks_Routes_RouteId",
                table: "Trucks",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

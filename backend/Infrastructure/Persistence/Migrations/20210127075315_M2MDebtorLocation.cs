using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class M2MDebtorLocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Debtors_BaseDebtorId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Debtors_DebtorId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Debtors_UpcomingDebtorId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Locations_BaseDebtorId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Locations_DebtorId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Locations_UpcomingDebtorId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "BaseDebtorId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "DebtorChangeDate",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "DebtorId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "UpcomingDebtorId",
                table: "Locations");

            migrationBuilder.CreateTable(
                name: "LocationDebtor",
                columns: table => new
                {
                    LocationId = table.Column<int>(type: "int", nullable: false),
                    DebtorId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationDebtor", x => new { x.DebtorId, x.LocationId });
                    table.ForeignKey(
                        name: "FK_LocationDebtor_Debtors_DebtorId",
                        column: x => x.DebtorId,
                        principalTable: "Debtors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LocationDebtor_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LocationDebtor_LocationId",
                table: "LocationDebtor",
                column: "LocationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LocationDebtor");

            migrationBuilder.AddColumn<int>(
                name: "BaseDebtorId",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DebtorChangeDate",
                table: "Locations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "DebtorId",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UpcomingDebtorId",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Locations_BaseDebtorId",
                table: "Locations",
                column: "BaseDebtorId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_DebtorId",
                table: "Locations",
                column: "DebtorId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_UpcomingDebtorId",
                table: "Locations",
                column: "UpcomingDebtorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Debtors_BaseDebtorId",
                table: "Locations",
                column: "BaseDebtorId",
                principalTable: "Debtors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Debtors_DebtorId",
                table: "Locations",
                column: "DebtorId",
                principalTable: "Debtors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Debtors_UpcomingDebtorId",
                table: "Locations",
                column: "UpcomingDebtorId",
                principalTable: "Debtors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

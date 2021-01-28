using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class DebtorEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateTable(
                name: "Debtors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Debtors", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Locations_DebtorId",
                table: "Locations",
                column: "DebtorId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_UpcomingDebtorId",
                table: "Locations",
                column: "UpcomingDebtorId");

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
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Debtors_DebtorId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Debtors_UpcomingDebtorId",
                table: "Locations");

            migrationBuilder.DropTable(
                name: "Debtors");

            migrationBuilder.DropIndex(
                name: "IX_Locations_DebtorId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Locations_UpcomingDebtorId",
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
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class RefillDeliveryDates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Refills",
                newName: "ExpectedDeliveryDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "ActualDeliveryDate",
                table: "Refills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActualDeliveryDate",
                table: "Refills");

            migrationBuilder.RenameColumn(
                name: "ExpectedDeliveryDate",
                table: "Refills",
                newName: "Date");
        }
    }
}

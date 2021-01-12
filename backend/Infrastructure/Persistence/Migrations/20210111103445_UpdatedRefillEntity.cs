using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdatedRefillEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Refills");

            migrationBuilder.AddColumn<double>(
                name: "EndAmount",
                table: "Refills",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "StartAmount",
                table: "Refills",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndAmount",
                table: "Refills");

            migrationBuilder.DropColumn(
                name: "StartAmount",
                table: "Refills");

            migrationBuilder.AddColumn<int>(
                name: "Amount",
                table: "Refills",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

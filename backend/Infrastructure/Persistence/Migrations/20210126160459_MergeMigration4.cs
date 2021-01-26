using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class MergeMigration4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DaysBetweenRefills",
                table: "LocationHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "EstimateFuelConsumption",
                table: "LocationHistories",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DaysBetweenRefills",
                table: "LocationHistories");

            migrationBuilder.DropColumn(
                name: "EstimateFuelConsumption",
                table: "LocationHistories");
        }
    }
}

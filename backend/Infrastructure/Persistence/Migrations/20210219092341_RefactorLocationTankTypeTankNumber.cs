using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class RefactorLocationTankTypeTankNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TankNumber",
                table: "FuelTanks");

            migrationBuilder.DropColumn(
                name: "TankType",
                table: "FuelTanks");

            migrationBuilder.AddColumn<string>(
                name: "TankNumber",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TankType",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TankNumber",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "TankType",
                table: "Locations");

            migrationBuilder.AddColumn<string>(
                name: "TankNumber",
                table: "FuelTanks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TankType",
                table: "FuelTanks",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

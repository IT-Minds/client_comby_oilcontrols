using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class CheckMerge2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Trucks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Trucks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "TankCapacity",
                table: "Trucks",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "TruckIdentifier",
                table: "Trucks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TruckNumber",
                table: "Trucks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StartRefillNumber",
                table: "TruckDailyStates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RefillNumber",
                table: "Refills",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "TankCapacity",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "TruckIdentifier",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "TruckNumber",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "StartRefillNumber",
                table: "TruckDailyStates");

            migrationBuilder.DropColumn(
                name: "RefillNumber",
                table: "Refills");
        }
    }
}

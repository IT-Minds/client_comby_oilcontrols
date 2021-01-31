using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class RefillMadePartOfTruck : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StartRefillNumber",
                table: "TruckDailyStates");

            migrationBuilder.AddColumn<int>(
                name: "RefillNumber",
                table: "Trucks",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefillNumber",
                table: "Trucks");

            migrationBuilder.AddColumn<int>(
                name: "StartRefillNumber",
                table: "TruckDailyStates",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

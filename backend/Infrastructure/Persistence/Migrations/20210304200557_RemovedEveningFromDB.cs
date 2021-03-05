using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class RemovedEveningFromDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EveningQuantity",
                table: "TruckDailyStates");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "EveningQuantity",
                table: "TruckDailyStates",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}

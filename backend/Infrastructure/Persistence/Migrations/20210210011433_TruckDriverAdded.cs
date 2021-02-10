using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class TruckDriverAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TruckId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_TruckId",
                table: "Users",
                column: "TruckId",
                unique: true,
                filter: "[TruckId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Trucks_TruckId",
                table: "Users",
                column: "TruckId",
                principalTable: "Trucks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Trucks_TruckId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_TruckId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TruckId",
                table: "Users");
        }
    }
}

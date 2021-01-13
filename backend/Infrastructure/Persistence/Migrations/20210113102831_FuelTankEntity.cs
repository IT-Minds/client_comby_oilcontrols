using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class FuelTankEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Locations",
                newName: "Schedule");

            migrationBuilder.RenameColumn(
                name: "TankNumber",
                table: "Locations",
                newName: "FuelTankId");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comments",
                table: "Locations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FuelTanks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<int>(type: "int", nullable: false),
                    TankNumber = table.Column<int>(type: "int", nullable: false),
                    TankCapacity = table.Column<double>(type: "float", nullable: false),
                    MinimumFuelAmount = table.Column<double>(type: "float", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FuelTanks", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Locations_FuelTankId",
                table: "Locations",
                column: "FuelTankId");

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_FuelTanks_FuelTankId",
                table: "Locations",
                column: "FuelTankId",
                principalTable: "FuelTanks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Locations_FuelTanks_FuelTankId",
                table: "Locations");

            migrationBuilder.DropTable(
                name: "FuelTanks");

            migrationBuilder.DropIndex(
                name: "IX_Locations_FuelTankId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "Comments",
                table: "Locations");

            migrationBuilder.RenameColumn(
                name: "Schedule",
                table: "Locations",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "FuelTankId",
                table: "Locations",
                newName: "TankNumber");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class LocationRoute : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Refills_Buildings_BuildingId",
                table: "Refills");

            migrationBuilder.DropForeignKey(
                name: "FK_Refills_Trucks_TruckId",
                table: "Refills");

            migrationBuilder.DropTable(
                name: "Buildings");

            migrationBuilder.RenameColumn(
                name: "TruckId",
                table: "Refills",
                newName: "RouteId");

            migrationBuilder.RenameColumn(
                name: "BuildingId",
                table: "Refills",
                newName: "LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Refills_TruckId",
                table: "Refills",
                newName: "IX_Refills_RouteId");

            migrationBuilder.RenameIndex(
                name: "IX_Refills_BuildingId",
                table: "Refills",
                newName: "IX_Refills_LocationId");

            migrationBuilder.AddColumn<int>(
                name: "RouteId",
                table: "Trucks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<int>(type: "int", nullable: false),
                    TankNumber = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trucks_RouteId",
                table: "Trucks",
                column: "RouteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Refills_Locations_LocationId",
                table: "Refills",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Refills_Routes_RouteId",
                table: "Refills",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Trucks_Routes_RouteId",
                table: "Trucks",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Refills_Locations_LocationId",
                table: "Refills");

            migrationBuilder.DropForeignKey(
                name: "FK_Refills_Routes_RouteId",
                table: "Refills");

            migrationBuilder.DropForeignKey(
                name: "FK_Trucks_Routes_RouteId",
                table: "Trucks");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "Routes");

            migrationBuilder.DropIndex(
                name: "IX_Trucks_RouteId",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "RouteId",
                table: "Trucks");

            migrationBuilder.RenameColumn(
                name: "RouteId",
                table: "Refills",
                newName: "TruckId");

            migrationBuilder.RenameColumn(
                name: "LocationId",
                table: "Refills",
                newName: "BuildingId");

            migrationBuilder.RenameIndex(
                name: "IX_Refills_RouteId",
                table: "Refills",
                newName: "IX_Refills_TruckId");

            migrationBuilder.RenameIndex(
                name: "IX_Refills_LocationId",
                table: "Refills",
                newName: "IX_Refills_BuildingId");

            migrationBuilder.CreateTable(
                name: "Buildings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TankNumber = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buildings", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Refills_Buildings_BuildingId",
                table: "Refills",
                column: "BuildingId",
                principalTable: "Buildings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Refills_Trucks_TruckId",
                table: "Refills",
                column: "TruckId",
                principalTable: "Trucks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

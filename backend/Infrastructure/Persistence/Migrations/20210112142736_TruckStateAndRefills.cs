using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class TruckStateAndRefills : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Coupons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TruckState",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MorningQuantity = table.Column<double>(type: "float", nullable: false),
                    EveningQuantity = table.Column<double>(type: "float", nullable: false),
                    TruckId = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TruckState", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TruckState_Trucks_TruckId",
                        column: x => x.TruckId,
                        principalTable: "Trucks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TruckRefill",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TimeStamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FuelcardNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    amount = table.Column<double>(type: "float", nullable: false),
                    TruckStateId = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TruckRefill", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TruckRefill_TruckState_TruckStateId",
                        column: x => x.TruckStateId,
                        principalTable: "TruckState",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TruckRefill_TruckStateId",
                table: "TruckRefill",
                column: "TruckStateId");

            migrationBuilder.CreateIndex(
                name: "IX_TruckState_TruckId",
                table: "TruckState",
                column: "TruckId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TruckRefill");

            migrationBuilder.DropTable(
                name: "TruckState");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Coupons");
        }
    }
}

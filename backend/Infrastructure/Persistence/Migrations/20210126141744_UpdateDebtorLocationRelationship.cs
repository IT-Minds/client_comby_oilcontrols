using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class UpdateDebtorLocationRelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Debtors_UpcomingDebtorId",
                table: "Locations");

            migrationBuilder.AddColumn<int>(
                name: "BaseDebtorId",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Locations_BaseDebtorId",
                table: "Locations",
                column: "BaseDebtorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Debtors_BaseDebtorId",
                table: "Locations",
                column: "BaseDebtorId",
                principalTable: "Debtors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Debtors_UpcomingDebtorId",
                table: "Locations",
                column: "UpcomingDebtorId",
                principalTable: "Debtors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Debtors_BaseDebtorId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Debtors_UpcomingDebtorId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_Locations_BaseDebtorId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "BaseDebtorId",
                table: "Locations");

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Debtors_UpcomingDebtorId",
                table: "Locations",
                column: "UpcomingDebtorId",
                principalTable: "Debtors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

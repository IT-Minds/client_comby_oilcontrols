using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class DebtorLocationChangeDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LocationDebtor_Debtors_DebtorId",
                table: "LocationDebtor");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationDebtor_Locations_LocationId",
                table: "LocationDebtor");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationDebtor",
                table: "LocationDebtor");

            migrationBuilder.RenameTable(
                name: "LocationDebtor",
                newName: "LocationDebtors");

            migrationBuilder.RenameIndex(
                name: "IX_LocationDebtor_LocationId_DebtorId_Type",
                table: "LocationDebtors",
                newName: "IX_LocationDebtors_LocationId_DebtorId_Type");

            migrationBuilder.AddColumn<DateTime>(
                name: "DebtorChangeDate",
                table: "LocationDebtors",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationDebtors",
                table: "LocationDebtors",
                columns: new[] { "DebtorId", "LocationId" });

            migrationBuilder.AddForeignKey(
                name: "FK_LocationDebtors_Debtors_DebtorId",
                table: "LocationDebtors",
                column: "DebtorId",
                principalTable: "Debtors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LocationDebtors_Locations_LocationId",
                table: "LocationDebtors",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LocationDebtors_Debtors_DebtorId",
                table: "LocationDebtors");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationDebtors_Locations_LocationId",
                table: "LocationDebtors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationDebtors",
                table: "LocationDebtors");

            migrationBuilder.DropColumn(
                name: "DebtorChangeDate",
                table: "LocationDebtors");

            migrationBuilder.RenameTable(
                name: "LocationDebtors",
                newName: "LocationDebtor");

            migrationBuilder.RenameIndex(
                name: "IX_LocationDebtors_LocationId_DebtorId_Type",
                table: "LocationDebtor",
                newName: "IX_LocationDebtor_LocationId_DebtorId_Type");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationDebtor",
                table: "LocationDebtor",
                columns: new[] { "DebtorId", "LocationId" });

            migrationBuilder.AddForeignKey(
                name: "FK_LocationDebtor_Debtors_DebtorId",
                table: "LocationDebtor",
                column: "DebtorId",
                principalTable: "Debtors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LocationDebtor_Locations_LocationId",
                table: "LocationDebtor",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

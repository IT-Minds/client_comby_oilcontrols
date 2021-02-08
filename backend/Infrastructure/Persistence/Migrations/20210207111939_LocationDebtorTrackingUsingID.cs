using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class LocationDebtorTrackingUsingID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationDebtors",
                table: "LocationDebtors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationDebtorHistories",
                table: "LocationDebtorHistories");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "LocationDebtors",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "LocationDebtorHistories",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "LocationDebtorId",
                table: "LocationDebtorHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationDebtors",
                table: "LocationDebtors",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationDebtorHistories",
                table: "LocationDebtorHistories",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_LocationDebtors_DebtorId",
                table: "LocationDebtors",
                column: "DebtorId");

            migrationBuilder.CreateIndex(
                name: "IX_LocationDebtorHistories_LocationId",
                table: "LocationDebtorHistories",
                column: "LocationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationDebtors",
                table: "LocationDebtors");

            migrationBuilder.DropIndex(
                name: "IX_LocationDebtors_DebtorId",
                table: "LocationDebtors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationDebtorHistories",
                table: "LocationDebtorHistories");

            migrationBuilder.DropIndex(
                name: "IX_LocationDebtorHistories_LocationId",
                table: "LocationDebtorHistories");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "LocationDebtors");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "LocationDebtorHistories");

            migrationBuilder.DropColumn(
                name: "LocationDebtorId",
                table: "LocationDebtorHistories");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationDebtors",
                table: "LocationDebtors",
                columns: new[] { "DebtorId", "LocationId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationDebtorHistories",
                table: "LocationDebtorHistories",
                columns: new[] { "LocationId", "DebtorId" });
        }
    }
}

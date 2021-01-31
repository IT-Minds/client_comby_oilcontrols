using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class DebtorLocationUniqueIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LocationDebtor_LocationId",
                table: "LocationDebtor");

            migrationBuilder.CreateIndex(
                name: "IX_LocationDebtor_LocationId_DebtorId_Type",
                table: "LocationDebtor",
                columns: new[] { "LocationId", "DebtorId", "Type" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LocationDebtor_LocationId_DebtorId_Type",
                table: "LocationDebtor");

            migrationBuilder.CreateIndex(
                name: "IX_LocationDebtor_LocationId",
                table: "LocationDebtor",
                column: "LocationId");
        }
    }
}

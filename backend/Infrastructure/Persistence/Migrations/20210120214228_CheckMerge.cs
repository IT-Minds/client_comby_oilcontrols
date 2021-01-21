using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Persistence.Migrations
{
    public partial class CheckMerge : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Street_Regions_RegionId",
                table: "Street");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Street",
                table: "Street");

            migrationBuilder.DropColumn(
                name: "RegiondId",
                table: "Street");

            migrationBuilder.RenameTable(
                name: "Street",
                newName: "Streets");

            migrationBuilder.RenameIndex(
                name: "IX_Street_RegionId",
                table: "Streets",
                newName: "IX_Streets_RegionId");

            migrationBuilder.AlterColumn<int>(
                name: "RegionId",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Streets",
                table: "Streets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Streets_Regions_RegionId",
                table: "Streets",
                column: "RegionId",
                principalTable: "Regions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Streets_Regions_RegionId",
                table: "Streets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Streets",
                table: "Streets");

            migrationBuilder.RenameTable(
                name: "Streets",
                newName: "Street");

            migrationBuilder.RenameIndex(
                name: "IX_Streets_RegionId",
                table: "Street",
                newName: "IX_Street_RegionId");

            migrationBuilder.AlterColumn<int>(
                name: "RegionId",
                table: "Locations",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "RegiondId",
                table: "Street",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Street",
                table: "Street",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Street_Regions_RegionId",
                table: "Street",
                column: "RegionId",
                principalTable: "Regions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

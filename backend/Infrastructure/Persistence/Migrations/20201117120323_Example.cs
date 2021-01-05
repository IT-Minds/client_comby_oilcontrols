using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace Infrastructure.Persistence.Migrations
{
  public partial class Example : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
          name: "ExampleEntityLists",
          columns: table => new
          {
            Id = table.Column<int>(type: "int", nullable: false)
                  .Annotation("SqlServer:Identity", "1, 1"),
            Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_ExampleEntityLists", x => x.Id);
          });

      migrationBuilder.CreateTable(
          name: "ExampleEntities",
          columns: table => new
          {
            Id = table.Column<int>(type: "int", nullable: false)
                  .Annotation("SqlServer:Identity", "1, 1"),
            Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
            ExampleEnum = table.Column<int>(type: "int", nullable: false),
            ExampleEntityListId = table.Column<int>(type: "int", nullable: true),
            CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
            Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
            LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
            LastModified = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_ExampleEntities", x => x.Id);
            table.ForeignKey(
                      name: "FK_ExampleEntities_ExampleEntityLists_ExampleEntityListId",
                      column: x => x.ExampleEntityListId,
                      principalTable: "ExampleEntityLists",
                      principalColumn: "Id",
                      onDelete: ReferentialAction.Restrict);
          });

      migrationBuilder.CreateIndex(
          name: "IX_ExampleEntities_ExampleEntityListId",
          table: "ExampleEntities",
          column: "ExampleEntityListId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "ExampleEntities");

      migrationBuilder.DropTable(
          name: "ExampleEntityLists");
    }
  }
}

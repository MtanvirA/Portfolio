using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NotificationError",
                table: "contact_messages",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NotificationSentAtUtc",
                table: "contact_messages",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NotificationStatus",
                table: "contact_messages",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "NotConfigured");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificationError",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "NotificationSentAtUtc",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "NotificationStatus",
                table: "contact_messages");
        }
    }
}

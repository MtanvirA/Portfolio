CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
);

START TRANSACTION;
CREATE TABLE `contact_messages` (
    `Id` char(36) NOT NULL,
    `Name` varchar(100) NOT NULL,
    `Email` varchar(150) NOT NULL,
    `Subject` varchar(200) NULL,
    `Message` varchar(4000) NOT NULL,
    `CreatedAtUtc` datetime(6) NOT NULL,
    `Status` varchar(50) NOT NULL DEFAULT 'New',
    `ClientIpHash` varchar(100) NULL,
    PRIMARY KEY (`Id`)
);

CREATE INDEX `ix_contact_messages_created_at_utc` ON `contact_messages` (`CreatedAtUtc`);

CREATE INDEX `ix_contact_messages_email` ON `contact_messages` (`Email`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20261024075230_InitialCreate', '10.0.12');

COMMIT;


/*
  Warnings:

  - You are about to drop the `Borrower` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[BorrowTransaction] DROP CONSTRAINT [BorrowTransaction_borrowerId_fkey];

-- DropTable
DROP TABLE [dbo].[Borrower];

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000),
    [department] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[UserPasswords] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [passwordHash] NVARCHAR(1000) NOT NULL,
    [salt] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [UserPasswords_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[BorrowTransaction] ADD CONSTRAINT [BorrowTransaction_borrowerId_fkey] FOREIGN KEY ([borrowerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

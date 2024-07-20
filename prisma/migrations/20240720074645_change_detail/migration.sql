/*
  Warnings:

  - You are about to drop the `TransactionDetail` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[TransactionDetail] DROP CONSTRAINT [TransactionDetail_materialId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TransactionDetail] DROP CONSTRAINT [TransactionDetail_transactionId_fkey];

-- DropTable
DROP TABLE [dbo].[TransactionDetail];

-- CreateTable
CREATE TABLE [dbo].[BorrowTransactionDetail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [transactionId] INT NOT NULL,
    [materialId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [BorrowTransactionDetail_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [BorrowTransactionDetail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[BorrowTransactionDetail] ADD CONSTRAINT [BorrowTransactionDetail_transactionId_fkey] FOREIGN KEY ([transactionId]) REFERENCES [dbo].[BorrowTransaction]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BorrowTransactionDetail] ADD CONSTRAINT [BorrowTransactionDetail_materialId_fkey] FOREIGN KEY ([materialId]) REFERENCES [dbo].[Material]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

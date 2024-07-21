import { PrismaClient } from '@prisma/client'
import { Transaction } from './Transaction'

export class TransactionManager {
    constructor(private prisma: PrismaClient) {}

    async runInTransaction<T>(
        callback: (transaction: Transaction) => Promise<T>
    ): Promise<T> {
        return this.prisma.$transaction(callback)
    }
}

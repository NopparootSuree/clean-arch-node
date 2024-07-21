import { BorrowTransaction } from './BorrowTransaction'
import { Material } from '../material/Material'

export class BorrowTransactionDetail {
    constructor(
        public id: number,
        public transaction: BorrowTransaction,
        public transactionId: number,
        public material: Material,
        public quantity: number,
        public createdAt: Date,
        public updatedAt: Date,
        public deleteAt: Date | null
    ) {}
}

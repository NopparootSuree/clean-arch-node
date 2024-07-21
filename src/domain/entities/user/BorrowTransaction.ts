import { User } from './User'

export class BorrowTransaction {
    constructor(
        public id: number,
        public borrower: User,
        public borrowerId: number,
        public borrowDate: Date,
        public returnDate: Date | null,
        public status: string,
        public createdAt: Date,
        public updatedAt: Date,
        public deleteAt: Date | null
    ) {}
}

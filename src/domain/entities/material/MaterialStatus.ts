import { Material } from "./Material";

export class MaterialStatus {
    constructor (
        public id: number,
        public material: Material,
        public materialId: number,
        public status: string,
        public createdAt: Date,
        public updatedAt: Date,
        public deleteAt: Date | null
    ) {}
}
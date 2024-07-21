import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Seed materials
    await prisma.material.createMany({
        data: [
            {
                name: 'Material A',
                description: 'Description for Material A',
                quantity: 100,
                unit: 'pcs',
            },
            {
                name: 'Material B',
                description: 'Description for Material B',
                quantity: 200,
                unit: 'pcs',
            },
        ],
    })

    // Seed borrowers
    await prisma.user.createMany({
        data: [
            {
                username: 'admin1',
                firstName: 'John',
                lastName: 'Doe',
                role: 'john.doe@example.com',
                phone: '1234567890',
                department: 'Engineering',
            },
            {
                username: 'admin2',
                firstName: 'Jane',
                lastName: 'Doe',
                role: 'jane.doe@example.com',
                phone: '0987654321',
                department: 'Marketing',
            },
        ],
    })

    // Seed borrow transactions
    await prisma.borrowTransaction.create({
        data: {
            borrowerId: 1,
            borrowDate: new Date(),
            status: 'borrowed',
            details: {
                create: [
                    { materialId: 1, quantity: 10 },
                    { materialId: 2, quantity: 20 },
                ],
            },
        },
    })

    // Seed material statuses
    await prisma.materialStatus.createMany({
        data: [
            { materialId: 1, status: 'available' },
            { materialId: 2, status: 'available' },
        ],
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

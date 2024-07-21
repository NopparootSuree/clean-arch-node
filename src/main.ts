import { PrismaClient } from '@prisma/client'
import { createApp } from './app'

const prisma = new PrismaClient()
const app = createApp(prisma)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

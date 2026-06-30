import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'rootedandnourished.coaching@gmail.com' } })
  if (!existing) {
    const hash = await bcrypt.hash('RootedCoach2024!', 12)
    await prisma.user.create({
      data: {
        name: 'Sophia Khosravi',
        email: 'rootedandnourished.coaching@gmail.com',
        password: hash,
        role: 'COACH',
      },
    })
    console.log('✅ Coach account created: rootedandnourished.coaching@gmail.com / RootedCoach2024!')
  } else {
    console.log('ℹ️  Coach account already exists')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

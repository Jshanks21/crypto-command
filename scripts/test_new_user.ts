const PrismaClient = require('@prisma/client').PrismaClient

const prisma = new PrismaClient()

// Create sample user data

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Jay',
      email: 'jay@gmail.com',
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
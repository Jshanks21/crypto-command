import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma/client';

// expand once we have email login & make login optional for use but required to save data

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //const { data } = req.body;

  const user = await prisma.user.create({
    data: {
      name: 'Jay',
      email: 'jay@gmail.com',
    },
  })
  console.log(user)
}
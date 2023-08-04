import 'server-only'
import { Suspense } from 'react'
import prisma from '@/prisma/client';
import { getCombinedAccountData } from '@/utils/actions'
import { Token, CustomSession } from '@/utils/types'
import GlobalBalances from '@/components/Balances';
import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]/route'

const getTokens = async (userId?: number | null): Promise<Token[]> => {
  if (!userId) return []
  try {
    const data = await prisma.account.findMany({
      where: {
        userId,
        tracking: true
      }
    })
    const allTokens = await getCombinedAccountData(data)
    return allTokens
  } catch (error: any) {
    console.log('get tokens error:', error)
    throw Error('Something went wrong!')
  }
}

export default async function Home() {
  const session: CustomSession | null = await getServerSession(authOptions)

  // If we have an active session pass the user id to the getTokens function to fetch the user's account data
  const allTokens = session?.user ? await getTokens(session.user.id) : []

  return (
    <>
      <section className="w-3/4 flex-center flex-col">
        <h1 className="head_text text-center mb-10">
          Crypto HQ
        </h1>
        <Suspense fallback={<div className='text-white'>Page is Loading...</div>}>
          <GlobalBalances allTokens={allTokens} />
        </Suspense>
      </section>
    </>
  )
}

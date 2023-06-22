import 'server-only'
import { Suspense } from 'react'
import prisma from '@/prisma/client';
import { getCombinedAccountData } from '@/utils/getTokens'
import { Token } from '@/utils/types'
import { GlobalBalances } from '@/components/client/Balances';

// Probably need to make a new GET endpoint for tokens to do the following. Then can check for logged in state in client components that use this data.

// Need to update findMany to look for accounts based on user_id in Session if available. Refactor to an API route since session is only on client side?
export const getTokens = async (): Promise<Token[]> => {
  try {
    const data = await prisma.account.findMany()
    const allTokens = await getCombinedAccountData(data)
    return allTokens
  } catch (error: any) {
    console.log('get tokens error:', error)
    throw Error('Something went wrong!')
  }
}

export default async function Home() {
  //const allTokens = await getTokens()

  return (
    <>
      <section className="w-3/4 flex-center flex-col">
        <h1 className="head_text text-center mb-10">
          Crypto Command HQ
        </h1>
        <Suspense fallback={<div className='text-white'>Page is Loading...</div>}>
          <GlobalBalances />
        </Suspense>
      </section>
    </>
  )
}

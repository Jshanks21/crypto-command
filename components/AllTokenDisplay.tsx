import 'server-only'
import prisma from '@/prisma/client';
import { Account } from '@prisma/client';
import { Token, getCombinedAccountData } from '@/utils/getTokens'
import Form from './Form';
import { GlobalBalances } from './Balances';

export const getTokens = async (): Promise<{ allTokens: Token[]; accounts: Account[]; }> => {
  try {
    const data = await prisma.account.findMany()
    const accountData = await getCombinedAccountData(data)
    return { allTokens: accountData, accounts: data }
  } catch (error: any) {
    console.log('get tokens error:', error)
    throw Error('Something went wrong!')
  }
}

const AllTokenDisplay = async () => {
  const { allTokens, accounts } = await getTokens()

  return (
    <>
      <Form accounts={accounts} />
      <section className='w-full flex flex-col gap-4 mt-4'>
        <GlobalBalances allTokens={allTokens} />
      </section>
    </>
  )
}

export default AllTokenDisplay
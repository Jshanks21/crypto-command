import 'server-only'
import prisma from '@/prisma/client';
import { Token, getMultipleAccountData } from '../utils/getTokens'
import Form from './Form';
import Balances from './Balances';

const getTokens = async (): Promise<Token[]> => {
  try {
    const data = await prisma.account.findMany()
    const accountData = await getMultipleAccountData(data)
    return accountData
  } catch (error: any) {
    console.log('get tokens error:', error)
    throw Error('Something went wrong!')
  }
}

const AllTokenDisplay = async () => {
  const allTokens = await getTokens()

  return (
    <>
      <Form />
      <section className='w-full flex flex-col gap-4 mt-4'>
        <Balances allTokens={allTokens} />
      </section>
    </>
  )
}

export default AllTokenDisplay
import 'server-only'
import prisma from '@/prisma/client';
import Image from 'next/image';
import type { Token } from '@prisma/client'

// TODO: add a fallback if DB doesn't work to use getAllTokens() from utils/getTokens.ts

const getDBTokens = async (): Promise<Token[]> => {
  try {
    const data = await prisma.token.findMany();
    //console.log('data:', data)
    return data
  } catch (error: any) {
    console.log('get tokens error:', error)
    throw Error('Something went wrong!')
  }
}

const Balances = ({ allTokens }: { allTokens: Token[] }) => {
  const sortedTokens = [...allTokens].sort((a, b) => a.id - b.id);
  const totalUSD = sortedTokens.reduce((acc, token) => acc + token.quote, 0)
  return (
    <>
      <div className='flex-between border border-slate-400 rounded-xl p-4'>
        <h2 className='text-xl font-semibold text-slate-100'>
          Total USD
        </h2>
        <span className='orange_gradient text-xl font-bold'>
          ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
        </span>
      </div>
      {sortedTokens.map((token: Token, i) => (
        <div key={token.contract_address + i} className='flex-between border border-slate-400 rounded-xl p-4'>
          <div>
            <h2 className='text-xl font-semibold text-slate-100'>
              {token.id}. {token.contract_symbol} Balance
            </h2>
            <span className='flex-center gap-2 orange_gradient text-xl font-bold'>
              <Image
                alt='token-logo'
                width={40}
                height={40}
                src={token.logo_url}
                className='rounded-full'
              />
              {(parseInt(token.balance) / 10 ** token.contract_decimals).toFixed(4)}
            </span>
          </div>

          <div>
            <h2 className='text-xl font-semibold text-slate-100'>
              {token.contract_symbol} Price
            </h2>
            <span className='orange_gradient text-xl font-bold'>
              ${token.quote_rate && token.quote_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
            </span>
          </div>

          <div>
            <h2 className='text-xl font-semibold text-slate-100'>
              Total Value
            </h2>
            <span className='orange_gradient text-xl font-bold'>
              ${token.quote && token.quote.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

const AllTokenDisplay = async () => {
  const allTokens = await getDBTokens()

  return (
    <section className='w-full flex flex-col gap-4'>
      <Balances allTokens={allTokens} />
    </section>
  )
}

export default AllTokenDisplay
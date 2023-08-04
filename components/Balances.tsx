'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Token } from '@/utils/types'
import Form from './Form'

// Consider replacing the fetch calls to our endpoints with SERVER ACTIONS instead to reduce code and hopefully improve performance and resolve the flickering issue below.
// Also see `useTransition()` for improving client side submissions or using server side logic/functions on the client
// There's also 'use server' that I could add in a function within a client to make it server side if that improves performance (careful with leaking secrets though)
// Reference: https://youtu.be/pDtlal2-oEE

const GlobalBalances = ({ allTokens }: { allTokens: Token[] }) => {
  //const { data: session } = useSession()

  const sortedByValue = useMemo(() => allTokens.sort((a, b) => b.quote - a.quote), [allTokens])
  const totalUSD = useMemo(() => allTokens.reduce((acc, token) => acc + token.quote, 0), [allTokens])

  return (
    <>
      <Form />
      <section className='w-full flex flex-col gap-4 mt-4'>
        <div className='flex-between border border-slate-400 rounded-xl p-4'>
          <h2 className='text-xl font-semibold text-slate-100'>
            Total USD
          </h2>
          <span className='orange_gradient text-xl font-bold'>
            ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
          </span>
        </div>

        {sortedByValue.map((token: Token, i) => (
          <Link key={token.contract_address + i} href={`/token/${token.contract_address}`}>
            <div className='flex-between border border-slate-400 rounded-xl p-4'>
              <div>
                <h2 className='text-xl font-semibold text-slate-100'>
                  {i += 1}. {token.contract_ticker_symbol} Balance
                </h2>
                <span className='flex-center gap-2 orange_gradient text-xl font-bold'>
                  <Image
                    alt='token-logo'
                    width={40}
                    height={40}
                    src={token.logo_url}
                    className='rounded-full'
                  />
                  {(parseInt(token.balance) / 10 ** token.contract_decimals).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) || 'N/A'}
                </span>
              </div>

              <div>
                <h2 className='text-xl font-semibold text-slate-100'>
                  {token.contract_ticker_symbol} Price
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
          </Link>
        ))}
      </section>
    </>
  )
}

export default GlobalBalances;
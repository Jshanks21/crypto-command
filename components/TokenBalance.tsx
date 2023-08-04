'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Token } from '@/utils/types'
import ListAccount from './ListAccounts'

export default function TokenBalances({ tokenData }: { tokenData: Token[] }) {
  const router = useRouter()

  const sortedByValue = useMemo(() => tokenData.sort((a, b) => b.quote - a.quote), [tokenData])
  const totalUSD = useMemo(() => tokenData.reduce((acc, token) => acc + token.quote, 0), [tokenData])
  const totalUnits = useMemo(() => tokenData.reduce((acc, token) => acc + parseInt(token.balance), 0), [tokenData])

  useEffect(() => {
    if (!sortedByValue || sortedByValue.length === 0) router.push('/')
  }, [sortedByValue])


  return (
    <>
      {sortedByValue.length !== 0 && (
        <>
          <Image
            alt='token-logo'
            width={120}
            height={120}
            src={sortedByValue[0]?.logo_url}
            className='rounded-full'
          />

          <section className='w-full flex flex-col gap-4 mt-4'>
            <div className='flex-between border border-slate-400 rounded-xl p-4'>

              <div className='flex-center gap-2'>
                <Image
                  alt='token-logo'
                  width={40}
                  height={40}
                  src={sortedByValue[0]?.logo_url}
                  className='rounded-full'
                />
                <h2 className='text-xl font-semibold text-slate-100'>
                  {sortedByValue[0]?.contract_ticker_symbol}
                </h2>
              </div>

              <div className='flex-center flex-col'>
                <h2 className='text-xl font-semibold text-slate-100'>
                  Total {sortedByValue[0]?.contract_ticker_symbol} Balance
                </h2>
                <span className='orange_gradient text-xl font-bold'>
                  {(totalUnits / 10 ** sortedByValue[0]?.contract_decimals).toFixed(4) || 'N/A'}
                </span>
              </div>

              <div className='flex-center flex-col'>
                <h2 className='text-xl font-semibold text-slate-100'>
                  Total USD
                </h2>
                <span className='orange_gradient text-xl font-bold'>
                  ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
                </span>
              </div>
            </div>

            {/* Add a chart here */}

            {/* Make everything that's mapped collapsible under this div */}
            <div className='flex'>
              <div className='w-full flex-between border border-slate-400 rounded-xl p-4'>
                <h2 className='text-xl font-semibold text-slate-100'>
                  Accounts
                </h2>

                <h2 className='text-xl font-semibold text-slate-100'>
                  {sortedByValue[0]?.contract_ticker_symbol} Balance
                </h2>

                <h2 className='text-xl font-semibold text-slate-100'>
                  USD Value
                </h2>
              </div>
            </div>

            {sortedByValue.map((token: Token, i: number) => (
              <div key={token.contract_address + i} className='flex-center'>
                <ListAccount
                  token={token}
                />
              </div>
            ))}
          </section>
        </>
      )}
    </>
  )
}
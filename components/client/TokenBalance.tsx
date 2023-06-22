'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Token } from '@/utils/types'
import trash from '@/public/assets/icons/trash.svg'
import { fetchSelectedToken } from '@/utils/actions'
import ListAccount from './ListAccounts'

const TokenBalances = ({ token_address }: { token_address: string }) => {
  //const { data: session } = useSession()
  const [selectedToken, setSelectedToken] = useState<Token[]>([])
  const [localAccounts, setLocalAccounts] = useState<string[]>([])


  const sortedByValue = useMemo(() => selectedToken.sort((a, b) => b.quote - a.quote), [selectedToken]);
  const totalUSD = useMemo(() => selectedToken.reduce((acc, token) => acc + token.quote, 0), [selectedToken]);
  const totalUnits = useMemo(() => selectedToken.reduce((acc, token) => acc + parseInt(token.balance), 0), [selectedToken]);

  console.log('sortedByValue', sortedByValue)


  // Reusable function to check if there are local accounts and set them to state
  const checkLocalAccounts: () => void = () => {
    const localAccounts = localStorage.getItem('accounts')
    if (!localAccounts) {
      console.log('no local accounts')
      return
    }
    setLocalAccounts(JSON.parse(localAccounts))
  }

  // Check for local accounts on mount
  useEffect(() => {
    checkLocalAccounts()
  }, [])

  // Fetch token when local accounts or token address updates (and on mount if there are local accounts)
  useEffect(() => {
    if (localAccounts.length === 0 || !token_address) return

    (async () => {
      const selectedToken = await fetchSelectedToken(token_address, localAccounts)
      console.log({ selectedToken })

      setSelectedToken(selectedToken || [])
    })();

  }, [token_address, localAccounts]);

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
              {/* Note: this is so the length matches to the mapped values; needs a better solution once better layout/display is found */}
              <Image
                alt='trash'
                src={trash}
                width={20}
                height={20}
                className='ml-2 opacity-0'
              />
            </div>


            {sortedByValue.map((token: Token, i: number) => (
              <div key={token.contract_address + i} className='flex-center'>               

                <ListAccount
                  token={token}
                  token_address={token_address}
                  localAccounts={localAccounts}
                  setLocalAccounts={setLocalAccounts}
                  setSelectedToken={setSelectedToken}
                />

              </div>
            ))}
          </section>
        </>
      )
      }



    </>
  )
}

export default TokenBalances
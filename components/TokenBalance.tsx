'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Token, CustomSession } from '@/utils/types'
import { fetchSelectedToken, fetchAccounts } from '@/utils/actions'
import ListAccount from './ListAccounts'
import { useSession } from 'next-auth/react'

const TokenBalances = ({ token_address }: { token_address: string }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedToken, setSelectedToken] = useState<Token[]>([])
  const [accounts, setAccounts] = useState<string[]>([])

  const sortedByValue = useMemo(() => selectedToken.sort((a, b) => b.quote - a.quote), [selectedToken]);
  const totalUSD = useMemo(() => selectedToken.reduce((acc, token) => acc + token.quote, 0), [selectedToken]);
  const totalUnits = useMemo(() => selectedToken.reduce((acc, token) => acc + parseInt(token.balance), 0), [selectedToken]);

  // Reusable function to check if there are local accounts and set them to state
  const checkAccounts: () => void = async () => {
    if (session && (session as CustomSession)?.user?.id) {
      console.log('active session:', session)

      try {
        const res = await fetchAccounts((session as CustomSession)?.user?.id)
        if (!res || res.length === 0) throw Error('Something went wrong! We could not fetch your tokens.')
        setAccounts(res)
      } catch (error: any) {
        console.log('Error fetching tokens:', error)
        throw Error('Something went wrong! We could not fetch your tokens.')
      }
    }
  }

  // Check for accounts on mount & reload
  useEffect(() => {
    checkAccounts()
  }, [session]);

  // Fetch token when accounts or token address updates (and on mount if there are local accounts)
  useEffect(() => {
    if (accounts.length === 0 || !token_address) return

    (async () => {
      const selectedToken = await fetchSelectedToken(token_address, accounts)
      console.log({ selectedToken })

      setSelectedToken(selectedToken || [])

      if (!selectedToken || selectedToken.length === 0) {
        console.log('redirecting to home page')
        router.push('/')
      }
    })();

  }, [token_address, accounts]);

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
                  token_address={token_address}
                  accounts={accounts}
                  setAccounts={setAccounts}
                  setSelectedToken={setSelectedToken}
                />
              </div>
            ))}
          </section>
        </>
      )}
    </>
  )
}

export default TokenBalances
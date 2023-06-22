'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Token } from '@/utils/types'
import { useSession } from 'next-auth/react'
import { CustomSession } from '@/utils/types'
import { getCombinedAccountData } from '@/utils/actions'
import { Form } from './Form'

// Consider replacing the fetch calls to our endpoints with SERVER ACTIONS instead to reduce code and hopefully improve performance and resolve the flickering issue below.
// Also see `useTransition()` for improving client side submissions or using server side logic/functions on the client
// There's also 'use server' that I could add in a function within a client to make it server side if that improves performance (careful with leaking secrets though)
// Reference: https://youtu.be/pDtlal2-oEE

const GlobalBalances = () => {
  const { data: session } = useSession()
  const [allTokens, setAllTokens] = useState<Token[]>([])

  const sortedByValue = useMemo(() => allTokens.sort((a, b) => b.quote - a.quote), [allTokens])
  const totalUSD = useMemo(() => allTokens.reduce((acc, token) => acc + token.quote, 0), [allTokens])

  useEffect(() => {
    fetchData();
  }, [allTokens, session]);

  const fetchData = async () => {
    if (session && (session as CustomSession)?.user?.id) {
      console.log('active session:', session)

      try {
        const response = await fetch(`/api/tokens?user_id=${(session as CustomSession)?.user?.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        const res = await response.json();

        console.log('res:', res);
        setAllTokens(res.data);
      } catch (error: any) {
        console.log('Error fetching tokens:', error)
        throw Error('Something went wrong! We could not fetch your tokens.')
      }

    }
    if (!session) {
      console.log('no session');
      try {
        const localAccounts = localStorage.getItem('accounts');
        if (!localAccounts) {
          console.log('no local accounts');
          return;
        }
        const allTokens = await getCombinedAccountData(JSON.parse(localAccounts));
        //console.log('allTokens in fn:', allTokens);
        setAllTokens(allTokens);
      } catch (error: any) {
        console.log('Error finding local tokens:', error)
        throw Error('Something went wrong getting your token data!')
      }

    }
  }

  return (
    <>
      <Form setAllTokens={setAllTokens} />

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

export { GlobalBalances }
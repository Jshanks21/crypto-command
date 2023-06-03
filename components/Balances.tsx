import 'server-only'
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Token } from '@/utils/getTokens'
import trash from '@/public/assets/icons/trash.svg'
import SingleTokenDisplay from './SingleTokenDisplay';

const TokenBalances = async({ tokenData }: { tokenData: Token[] }) => {
  //const tokensToShare = tokenData.filter((token) => token.quote && token.quote < 500)
  const sortedByValue = useMemo(() => tokenData.sort((a, b) => b.quote - a.quote), [tokenData])
  const totalUSD = useMemo(() => tokenData.reduce((acc, token) => acc + token.quote, 0), [tokenData])
  const totalUnits = useMemo(() => tokenData.reduce((acc, token) => acc + parseInt(token.balance), 0), [tokenData])

  return (
    <>
      <Image
        alt='token-logo'
        width={120}
        height={120}
        src={tokenData[0].logo_url}
        className='rounded-full'
      />

      <section className='w-full flex flex-col gap-4 mt-4'>
        <div className='flex-between border border-slate-400 rounded-xl p-4'>

          <div className='flex-center gap-2'>
            <Image
              alt='token-logo'
              width={40}
              height={40}
              src={tokenData[0].logo_url}
              className='rounded-full'
            />
            <h2 className='text-xl font-semibold text-slate-100'>
              {tokenData[0].contract_ticker_symbol}
            </h2>
          </div>

          <div className='flex-center flex-col'>
            <h2 className='text-xl font-semibold text-slate-100'>
              Total {tokenData[0].contract_ticker_symbol} Balance
            </h2>
            <span className='orange_gradient text-xl font-bold'>
              {(totalUnits / 10 ** tokenData[0].contract_decimals).toFixed(4) || 'N/A'}
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
              {tokenData[0].contract_ticker_symbol} Balance
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

        {sortedByValue.map((token: Token, i) => (
          <div key={token.contract_address + i} className='flex-center'>
            <SingleTokenDisplay token={token} />
          </div>
        ))}
      </section>
    </>
  )
}

const GlobalBalances = ({ allTokens }: { allTokens: Token[] }) => {
  //const tokensToShare = allTokens.filter((token) => token.quote && token.quote < 500)
  const sortedByValue = useMemo(() => allTokens.sort((a, b) => b.quote - a.quote), [allTokens])
  const totalUSD = useMemo(() => allTokens.reduce((acc, token) => acc + token.quote, 0), [allTokens])

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

      {sortedByValue.map((token: Token, i) => (
        <Link href={`/token/${token.contract_address}`}>
          <div key={token.contract_address + i} className='flex-between border border-slate-400 rounded-xl p-4'>
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
                {(parseInt(token.balance) / 10 ** token.contract_decimals).toFixed(4)}
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
    </>
  )
}

export { GlobalBalances, TokenBalances }
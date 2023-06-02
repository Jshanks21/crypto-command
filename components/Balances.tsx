import { useMemo } from 'react';
import Image from 'next/image';
import { Token } from '../utils/getTokens'

const Balances = ({ allTokens }: { allTokens: Token[] }) => {
  //const tokensToShare = allTokens.filter((token) => token.quote && token.quote < 1000)
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
        <div key={token.contract_address + i} className='flex-between border border-slate-400 rounded-xl p-4'>
          <div>
            <h2 className='text-xl font-semibold text-slate-100'>
              {i+=1}. {token.contract_ticker_symbol} Balance
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
      ))}
    </>
  )
}

export default Balances
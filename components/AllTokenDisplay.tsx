import 'server-only'
import { getAllTokens, Token } from '@/utils/getPrices'

const Balances = ({ allTokens }: { allTokens: Token[] }) => {
  return (
    <>
      {allTokens.map((token: Token, i) => (
        <div key={token.contract_address + i} className='flex-between border border-slate-400 rounded-xl p-4'>

          <div>
            <h2 className='text-xl font-semibold text-slate-100'>
              {token.contract_ticker_symbol} Balance
            </h2>
            <span className='flex-center gap-2 orange_gradient text-xl font-bold'>
              {/* TODO: needs configuration update for multiple hostnames in next.config to use next/image */}
              <img
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
              ${token.quote_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
            </span>
          </div>

          <div>
            <h2 className='text-xl font-semibold text-slate-100'>
              Total Value
            </h2>
            <span className='orange_gradient text-xl font-bold'>
              {token.pretty_quote}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

const AllTokenDisplay = async () => {
  const allTokens = await getAllTokens()

  return (
    <section className='w-full flex flex-col gap-4'>
      <Balances allTokens={allTokens} />
    </section>
  )
}

export default AllTokenDisplay
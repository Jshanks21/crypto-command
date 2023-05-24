import 'server-only'
import { RETH } from '@/utils/constants'
import { getEthBalance, getTokenBalance, calculateTotalBalance } from '@/utils/getBalances'
import { getEthPrice } from '@/utils/getPrices'

const TotalBalance = ({ price, amount }: { price: number, amount: number }) => {
  const totalBalance = calculateTotalBalance(price, amount)

  return (
    <>
      <h2 className='text-xl font-semibold mt-4'>
        Total Value
      </h2>
      <span className='orange_gradient text-xl font-bold'>
        ${totalBalance || 'Loading...'}
      </span>
    </>
  )
}


const Balance = async () => {
  const ethPriceData = getEthPrice()
  const ethBalanceData = getEthBalance()
  const tokenBalanceData = getTokenBalance(RETH)

  const [ethPrice, ethBalance, tokenBalance] = await Promise.all([ethPriceData, ethBalanceData, tokenBalanceData]);

  return ( 
    <>
      <section className='w-full flex-between'>

        <div className='border border-slate-400 p-4'>
          <h2 className='text-xl font-semibold'>
            ETH Balance
          </h2>
          <span className='orange_gradient text-xl font-bold'>
            Ξ {ethBalance.toLocaleString('en-US') || 'Loading...'}
          </span>
  
          <h2 className='text-xl font-semibold mt-4 p-4 '> 
            ETH Price
          </h2>
          <span className='orange_gradient text-xl font-bold'>
            ${ethPrice.toLocaleString('en-US') || 'Loading...'}
          </span>

          {/* TotalBalance is synchronous so Suspense isn't needed since we aren't awaiting data within the component */}
          {ethPrice && ethBalance &&
            <TotalBalance
              price={ethPrice}
              amount={ethBalance}
            />
          }
        </div>

        <div className='border border-slate-400 p-4'>
          <h2 className='text-xl font-semibold'>
            RETH Balance
          </h2>
          <span className='orange_gradient text-xl font-bold'>
            {tokenBalance.toLocaleString('en-US', { minimumFractionDigits: 3 }) || 'Loading...'}
          </span>

          <h2 className='text-xl font-semibold mt-4'>
            RETH Price (using ETH price rn)
          </h2>
          <span className='orange_gradient text-xl font-bold'>
            ${ethPrice.toLocaleString('en-US') || 'Loading...'}
          </span>

          {/* TotalBalance is synchronous so Suspense isn't needed since we aren't awaiting data within the component */}
          {ethPrice && tokenBalance &&
            <TotalBalance
              price={ethPrice}
              amount={tokenBalance}
            />
          }
        </div>

      </section>

    </>
  )
}

export default Balance
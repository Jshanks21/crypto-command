'use server'
import 'server-only'
import { getSingleAccountData } from '@/utils/actions'
import { Token } from '@/utils/types'
import prisma from '@/prisma/client';
import { Suspense } from 'react'
import TokenBalances from '@/components/TokenBalance';
//import { TokenBalances } from '@/components/client/Balances';


// Need to update findMany to look for accounts based on user_id in Session if available. Refactor to an API route since session is only on client side?

// Is making this an API endpoint the reason that deleting tokens is not as smooth as adding them in the not logged in flow? Not logged in has a visible reload when deleting accounts, but I don't remember that when we were testing deletion with the logged in flow. At that point we were using the data below, which is not an API endpoint like we're using now. 

// but that doesn't account for why adding accounts is stil smooth in both flows. 

// even if that's the case, we need it to be an endpoint because we need the user ID from session, which I can only get from the client side. so I can't pass that from a client component to a server component. unless there's another way to get the user ID from session on the server side? and this all assumes that's the reason for the difference in smoothness, so don't make any changes until we know that's the reason for sure.

// async function getTokenDetails(address: string, chain = 1) {
//   // Get all accounts
//   const accounts = await prisma.account.findMany()

//   // Get token data for each account
//   const tokenData: Token[][] = await Promise.all(accounts.map(async (account) => {
//     return getSingleAccountData(account.address, chain)
//   }))

//   // Flatten the arrays to have a single array with all tokens
//   const allTokens: Token[] = tokenData.flat()

//   // Filter the tokens to only include the selected token
//   const selectedToken = allTokens.filter((token: Token) => {
//     return address === token.contract_address
//   })

//   return selectedToken
// }


//@ts-ignore: @ts-expect-error Async Server Component

async function Overview({ params }: { params: any }) {
  //const tokenData = await getTokenDetails(params.address)

  return (
    <>
    {/* add Suspense? loading.tsx seems to take over then replaced w/ Suspense loading briefly, so is there value in Suspense? */}
        
        <TokenBalances token_address={params.address} />
    </>
  )
}

export default Overview
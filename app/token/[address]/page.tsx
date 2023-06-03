import 'server-only'
import { TokenBalances } from '@/components/Balances';
import { Token, getSingleAccountData } from '@/utils/getTokens'
import { Account } from '@prisma/client';
import prisma from '@/prisma/client';

async function getTokenDetails(accounts: Account[], address: string, chain = 1) {
  // Get token data for each account
  const tokenData: Token[][] = await Promise.all(accounts.map(async (account) => {
    return getSingleAccountData(account.address, chain)
  }))

  // Flatten the arrays to have a single array with all tokens
  const allTokens: Token[] = tokenData.flat()

  // Filter the tokens to only include the selected token
  const selectedToken = allTokens.filter((token: Token) => {
    return address === token.contract_address
  })

  return selectedToken
}

async function Overview({ params }: { params: { address: string } }) {
  const accounts = await prisma.account.findMany()
  const tokenData = await getTokenDetails(accounts, params.address)

  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <TokenBalances tokenData={tokenData} />
    </>
  )
}

export default Overview
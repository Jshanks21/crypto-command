import 'server-only'
import { getSingleAccountData } from '@/utils/actions'
import { Token, CustomSession } from '@/utils/types'
import prisma from '@/prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import TokenBalances from '@/components/TokenBalance'

const getTokenDetails = async (address: string, userId?: number | null, chain = 1): Promise<Token[]> => {
  if (!userId || !address) return []
  // Get all user's accounts
  const accounts = await prisma.account.findMany({
    where: {
      userId,
      tracking: true
    }
  })

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

export default async function TokenPage({ params }: { params: any }) {
  const session: CustomSession | null = await getServerSession(authOptions)
  const tokenData = session?.user ? await getTokenDetails(params.address, session.user.id) : []

  return (
    <>
      {/* add Suspense? loading.tsx seems to take over then replaced w/ Suspense loading briefly, so is there value in Suspense? */}
      <TokenBalances tokenData={tokenData} />
    </>
  )
}
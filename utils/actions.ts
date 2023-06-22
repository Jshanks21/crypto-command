'use server'
import 'server-only'
import { getSingleAccountData } from './getTokens';
import { Token } from './types'

// TODO: this should revalidate Path at the end whether filteredAccounts is empty or not?
async function fetchSelectedToken(token_address: string, filteredAccounts: string[]) {
  if (!token_address || filteredAccounts.length === 0) {
    console.log('Warning: No token address or accounts to fetch')
    return
  };

  try {
    // Get token data for each account
    const tokenData: Token[][] = await Promise.all(filteredAccounts.map(async (account) => {
      return getSingleAccountData(account, 1)
    }))

    // Flatten the arrays to have a single array with all tokens
    const allTokens: Token[] = tokenData.flat()

    // Filter the tokens to only include the selected token
    const selectedToken = allTokens.filter((token: Token) => {
      return token_address === token.contract_address
    })

    return selectedToken
  } catch (error: any) {
    console.log('Error fetching tokens:', error)
    throw Error('Something went wrong! We could not fetch your tokens.')
  }
}

export { fetchSelectedToken }
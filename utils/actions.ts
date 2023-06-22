'use server'
import 'server-only'
import { Token } from './types'
import prisma from '@/prisma/client'
import { Account } from '@prisma/client' // this convention is easy to mistake with the above... 🤔

const COVALENT_API_KEY = process.env.NEXT_PUBLIC_COVALENT_API_KEY

async function fetchSavedAccounts(user_id: number | null | undefined) {
  if (!user_id) {
    console.log('Missing user_id')
    return
  }

  // Get all accounts for user
  const accountInfo = await prisma.account.findMany({
    where: {
      userId: user_id
    }
  })

  if (!accountInfo) {
    console.log('No accounts found for user')
    return
  }

  //map over accounts and only return the address
  const filteredAccounts = accountInfo.map((account) => {
    return account.address
  })

  return filteredAccounts
}

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

const getDataFromCovalentAPI = async (URL: string): Promise<Token[]> => {
  let headers = new Headers()
  const authString = `${COVALENT_API_KEY}:`
  headers.set('Authorization', 'Basic ' + btoa(authString))

  const resp = await fetch(URL, { method: 'GET', headers: headers, next: { revalidate: 3600 } }) // revalidate every hour 
  if (resp.status !== 200) {
    console.log('Error fetching token data:', resp.status, resp.statusText)
    throw new Error('Invalid response')
  }

  const json = await resp.json()
  return json.data.items
}

const getSingleAccountData = async (address: string, chain = 1, nft = false, getCachedNFTs = false) => {
  let URL = `https://api.covalenthq.com/v1/${chain}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=${nft}&no-nft-fetch=${getCachedNFTs}`
  let tokens = await getDataFromCovalentAPI(URL)

  // Add the account address that holds the tokens to each token
  tokens = tokens.map(token => ({ ...token, account: address }))

  // Filter out tokens with little or no balance or no quote
  return tokens.filter((token: Token) => {
    return token.contract_ticker_symbol !== 'CGCX' && token.contract_ticker_symbol !== 'BCT' &&
      BigInt(token.balance) > 0n && token.quote > 0 && token.type !== 'dust'
  })
}

async function getTokenDetails(token_address: string, accounts: string[], chain = 1) {
  // Get all accounts
  //const accounts = await prisma.account.findMany()

  // Get token data for each account
  const tokenData: Token[][] = await Promise.all(accounts.map(async (account) => {
    return getSingleAccountData(account, chain)
  }))

  // Flatten the arrays to have a single array with all tokens
  const allTokens: Token[] = tokenData.flat()

  // Filter the tokens to only include the selected token
  const selectedToken = allTokens.filter((token: Token) => {
    return token_address === token.contract_address
  })

  return selectedToken
}

const getCombinedAccountData = async (accounts: Account[] | string[], chain = 1, nft = false, getCachedNFTs = false) => {
  // Get token data for each account
  let tokenData: Token[][] = []
  if (typeof accounts[0] === 'string') {
    // If the first element is a string, then we have an array of addresses
    tokenData = await Promise.all((accounts as string[]).map(async (account) => {
      return getSingleAccountData(account, chain, nft, getCachedNFTs)
    }))
    // If the first element is an object, then we have an array of Account types
  } else if (typeof accounts[0] === 'object') {
    tokenData = await Promise.all((accounts as Account[]).map(async (account) => {
      return getSingleAccountData(account.address, chain, nft, getCachedNFTs)
    }))
  }


  // Flatten the arrays to have a single array with all tokens
  const allTokens: Token[] = tokenData.flat()

  // Combine the balances of duplicate tokens
  const combinedTokens = allTokens.reduce((acc: Token[], token: Token) => {
    const existingToken = acc.find((t: Token) => t.contract_address === token.contract_address)
    if (existingToken) {
      existingToken.balance = (BigInt(existingToken.balance) + BigInt(token.balance)).toString()
      existingToken.quote = existingToken.quote + token.quote
      return acc
    } else {
      return [...acc, token]
    }
  }, [])

  return combinedTokens
}

export { fetchSelectedToken, fetchSavedAccounts, getCombinedAccountData, getSingleAccountData, getTokenDetails }
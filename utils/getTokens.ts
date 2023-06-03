import { Account } from '@prisma/client';
const COVALENT_API_KEY= process.env.NEXT_PUBLIC_COVALENT_API_KEY

export type Token = {
  contract_decimals: number,
  contract_name: string,
  contract_ticker_symbol: string,
  contract_address: string,
  supports_erc: string[],
  logo_url: string,
  last_transferred_at: string,
  native_token: boolean,
  type: string,
  balance: string,
  balance_24h: string,
  quote_rate: number,
  quote_rate_24h: number,
  quote: number,
  pretty_quote: string,
  quote_24h: number,
  pretty_quote_24h: string,
  nft_data: boolean | null,
  is_spam: boolean | null,
  account: string,
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
  let tokens: Token[] = await getDataFromCovalentAPI(URL)

  // Add the account address that holds the tokens to each token
  tokens = tokens.map(token => ({ ...token, account: address }))

  return tokens.filter((token: Token) => {
    return token.contract_ticker_symbol !== 'CGCX' && token.contract_ticker_symbol !== 'BCT' //consider refactoring this to be a list of spam/trash tokens to filter out
  })
  .filter((token: Token) => {
    return BigInt(token.balance) > 0n && token.quote > 0 && token.type !== 'dust'
  })
}

const getCombinedAccountData = async (accounts: Account[], chain = 1, nft = false, getCachedNFTs = false) => {
  // Get token data for each account
  const tokenData: Token[][] = await Promise.all(accounts.map(async (account) => {
    return getSingleAccountData(account.address, chain, nft, getCachedNFTs)
  }))

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

  //console.log('token data', combinedTokens)
  return combinedTokens
}

export { getCombinedAccountData, getSingleAccountData, getDataFromCovalentAPI }
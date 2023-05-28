import { TEST_ACCOUNTS as STATIC_ACCOUNTS } from '@/utils/constants'

const COVALENT_API_KEY= process.env.COVALENT_API_KEY

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
}

const getDataFromCovalentAPI = async (URL: string) => {
  let headers = new Headers()
  const authString = `${COVALENT_API_KEY}:`
  headers.set('Authorization', 'Basic ' + btoa(authString))

  const resp = await fetch(URL, { method: 'GET', headers: headers, next: { revalidate: 3600 } })
  if (resp.status !== 200) throw new Error('Invalid response')

  const json = await resp.json()
  return json.data.items
}

const getAllTokens = async (chain = 1, nft = false, getCachedNFTs = false) => {

  const data: Token[][] = await Promise.all(STATIC_ACCOUNTS.map(async (address) => {
    let URL = `https://api.covalenthq.com/v1/${chain}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=${nft}&no-nft-fetch=${getCachedNFTs}`

    const tokens: Token[] = await getDataFromCovalentAPI(URL)

    const filterSpamAndZeroValue = tokens.filter((token: Token) => {
      return token.contract_ticker_symbol !== 'CGCX' && token.contract_ticker_symbol !== 'BCT' //consider refactoring this to be a list of spam/trash tokens to filter out
    })
    .filter((token: Token) => parseInt(token.balance) > 0)

    return filterSpamAndZeroValue
  }))

  const flattenedData: Token[] = data.flat()

  //console.log('token data', flattenedData)
  return flattenedData
}

export { getAllTokens }
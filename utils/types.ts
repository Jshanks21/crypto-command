import { Session, ISODateString} from 'next-auth';

export interface CustomSession extends Session {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    id?: number | null
  },
  expires: ISODateString
}

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
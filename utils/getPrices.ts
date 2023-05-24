const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const getEthPrice = async (): Promise<number> => {
  const response = await fetch(
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCAN_API_KEY}`,
    { next: { revalidate: 1800 } }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch Eth price data');
  }

  const json = await response.json()
  return Number(json.result.ethusd)
}

export { getEthPrice }
import { cache } from 'react'
import { ethers } from 'ethers'
import { STATIC_ACCOUNTS } from '@/utils/constants'

const ETH_ALCHEMY_KEY = process.env.ETH_ALCHEMY_KEY

const getTokenBalance = cache(async (tokenAddress: string, addresses?: string[]): Promise<number> => {
  const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${ETH_ALCHEMY_KEY}`)
  const tokenContract = new ethers.Contract(tokenAddress, ['function balanceOf(address account) view returns (uint256)'], provider)

  addresses = addresses ?? STATIC_ACCOUNTS
  const balancePromises = addresses?.map((address) => tokenContract.balanceOf(address))
  const balances = await Promise.all(balancePromises)
  const reduced = balances.reduce((accumulator, balance) => accumulator + balance, ethers.toBigInt('0'))

  return Number(ethers.formatEther(reduced))
})

const getEthBalance = cache(async (addresses?: string[]): Promise<number> => {
  const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${ETH_ALCHEMY_KEY}`)

  addresses = addresses ?? STATIC_ACCOUNTS
  const balancePromises = addresses?.map((address) => provider.getBalance(address))
  const balances = await Promise.all(balancePromises)
  const reduced = balances.reduce((accumulator, balance) => accumulator + balance, ethers.toBigInt('0'))

  return Number(ethers.formatEther(reduced))
})

const calculateTotalBalance = (price: number, amount: number): string => {
  const a = price
  const b = amount

  const result = a * b

  // Convert to a number with 2 decimal places
  const formattedResult = result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return formattedResult
}

export { getTokenBalance, getEthBalance, calculateTotalBalance }
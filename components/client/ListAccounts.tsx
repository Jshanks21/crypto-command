'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import trash from '@/public/assets/icons/trash.svg'
import { fetchSelectedToken } from '@/utils/actions'
import { Token } from '@/utils/types'

type ListAccountProps = {
  token: Token
  token_address: string
  localAccounts: string[]
  setLocalAccounts: (localAccounts: string[]) => void
  setSelectedToken: (selectedToken: Token[]) => void
}

function ListAccount({ token, token_address, localAccounts, setLocalAccounts, setSelectedToken }: ListAccountProps) {
  const [isPending, startTransition] = useTransition()

  // Function that deletes account from local storage and updates local accounts & selected token state
  const handleDelete = async (account: string) => {
    if (!account) return;

    try {
      // Find account in localStorage and remove it
      const filteredAccounts: string[] = (localAccounts || '[]').filter((acc: string) => acc !== account)

      localStorage.setItem('accounts', JSON.stringify(filteredAccounts))

      console.log('filteredAccounts', filteredAccounts)
      setLocalAccounts(filteredAccounts)

      //update the token balances
      const selectedToken = await fetchSelectedToken(token_address, filteredAccounts)
      setSelectedToken(selectedToken || [])
    } catch (error: any) {
      console.log('Error deleting account:', error)
      throw Error('Something went wrong! We could not delete your account.')
    }
  }

  return (
    <>
      <div className='w-full flex-between border border-slate-400 rounded-xl p-4'>
        <div>
          <span className='orange_gradient text-xl font-bold'>
            {token.account.slice(0, 5) || '???'}...{token.account.slice(-3) || '???'}
          </span>
        </div>

        <div>
          <span className='orange_gradient text-xl font-bold mr-12'>
            {(parseInt(token.balance) / 10 ** token.contract_decimals).toFixed(4) || 'N/A'}
          </span>
        </div>

        <div>
          <span className='orange_gradient text-xl font-bold'>
            ${token.quote && token.quote.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
          </span>
        </div>
      </div>
      <button onClick={() => startTransition(() => handleDelete(token.account))}>
        <Image
          alt='trash'
          src={trash}
          width={20}
          height={20}
          className='cursor-pointer ml-2'
        />
      </button>
    </>
  )
}

export default ListAccount
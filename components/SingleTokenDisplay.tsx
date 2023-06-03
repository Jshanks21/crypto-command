'use client'
import React from 'react'
import { Token } from '@/utils/getTokens'
import Image from 'next/image'
import trash from '@/public/assets/icons/trash.svg'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CustomSession } from '@/utils/types'


const SingleTokenDisplay = ({token}: {token: Token}) => {
  const router = useRouter()
  const { data: session } = useSession()

  const handleDelete = async (account: string) => {
    // Need handle the localStorage case when not logged in
    //const localAccounts = localStorage.getItem('accounts');

    if (!session) {
      alert('Please login to delete an address')
      return
    }

    // Save accounts to DB
    const res = await fetch(`/api/accounts/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ account, user_id: (session as CustomSession)?.user?.id })
    })

    //Check for errors
    if (!res.ok) {
      const data = await res.json()
      console.log('data:', data)
      alert('error:' + data.message[0]?.meta)
    } else {
      alert('Successfully deleted address!')
    }

    router.refresh() 
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
      <Image
        alt='trash'
        src={trash}
        width={20}
        height={20}
        onClick={() => handleDelete(token.account)}
        className='cursor-pointer ml-2'
      />
    </>
  )
}

export default SingleTokenDisplay
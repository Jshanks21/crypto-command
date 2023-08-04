'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CustomSession } from '@/utils/types'
import { getCombinedAccountData } from '@/utils/actions'
import { Token } from '@/utils/types'

export default function Form() {
  const router = useRouter()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [addressInput, setAddressInput] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }

  // const fetchData = async () => {
  //   if (session && (session as CustomSession)?.user?.id) {
  //     console.log('active session:', session)

  //     try {
  //       const response = await fetch(`/api/tokens?user_id=${(session as CustomSession)?.user?.id}`, {
  //         method: 'GET',
  //         headers: { 'Content-Type': 'application/json' }
  //       })
  //       const res = await response.json();

  //       console.log('res:', res);
        
  //       //setAllTokens(res.data);
  //     } catch (error: any) {
  //       console.log('Error fetching tokens:', error)
  //       throw Error('Something went wrong! We could not fetch your tokens.')
  //     }

  //   }
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!addressInput) return alert('Please enter an address')
    setSubmitting(true)

    try {
      // Extract addresses from the input using a regular expression
      const regex = /0x[a-fA-F0-9]{40}/g;
      const newAccounts: string[] = addressInput.match(regex) || [];

      // Save to DB
      const res = await fetch('/api/accounts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accounts: newAccounts, user_id: (session as CustomSession)?.user?.id })
      })

      // Check for errors
      if (!res.ok) {
        const data = await res.json()
        console.log('data:', data)

        alert('error:' + data.message[0]?.meta)
      }
      setSubmitting(false)
      setAddressInput('')

      // Page refresh isn't working?...
      router.refresh()
    } catch (error: any) {
      console.log('Error saving tokens:', error)
      throw Error('Something went wrong saving your token data!')
    }
  }

  return (
    <>
      <button
        className='w-1/3 text-center hover:bg-blue-400 transition duration-300 ease-in-out cursor-pointer font-satoshi font-semibold text-base text-white border border-gray-200 rounded-full p-2 mb-2'
        onClick={() => {
          setOpen(!open)
          handleClick()
        }}
      >
        Add New Address
      </button>

      <form onSubmit={handleSubmit} className={`w-full flex-between gap-2 ${open ? 'form active' : 'form inactive'}`}>
        <input
          type='text'
          name='new_address'
          value={addressInput}
          ref={inputRef}
          onChange={(e) => setAddressInput(e.target.value)}
          className='form_input border border-solid border-white focus:ring-2 focus:ring-blue-600 focus:border-transparent'
          placeholder='Enter all addresses to track. They must begin with "0x".'
          required
        />
        <button
          type='submit'
          className='w-32 p-3 mt-2 bg-blue-400 hover:bg-blue-800 text-white text-sm rounded-lg font-semibold transition duration-300 ease-in-out'
          disabled={submitting}
        >
          {submitting ? 'Updating Balances...' : 'Add'}
        </button>
      </form>
    </>
  )
}
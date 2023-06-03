'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Account } from '@prisma/client'
import { CustomSession } from '@/utils/types'

function Form({ accounts }: { accounts: Account[]}) {
  const router = useRouter()
  const { data: session } = useSession()
  const [submitting, setSubmitting] = useState(false)
  const [addressInput, setAddressInput] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!addressInput) return alert('Please enter an address')
    setSubmitting(true)

    // Extract addresses from the input using a regular expression
    const regex = /0x[a-fA-F0-9]{40}/g;
    const accounts = addressInput.match(regex) || [];

    // Save to localStorage
    localStorage.setItem('accounts', JSON.stringify(accounts));

    // Save accounts to DB
    const res = await fetch('/api/accounts/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accounts, user_id: (session as CustomSession)?.user?.id })
    })    

    // Check for errors
    if (!res.ok) {
      const data = await res.json()
      console.log('data:', data)

      setSubmitting(false)
      alert('error:' + data.message[0]?.meta)
    } else {
      setSubmitting(false)
      alert('Successfully added new addresses!')
    }

    // Reset form input
    setAddressInput('');
    router.refresh() 
  }

  useEffect(() => {
    const savedAccounts = localStorage.getItem('accounts')
    if (!savedAccounts) {
      localStorage.setItem('accounts', JSON.stringify(accounts))
    }
  }, [])

  return (
    <>
      <button
        className='w-1/3 text-center hover:bg-blue-400 transition duration-300 ease-in-out cursor-pointer font-satoshi font-semibold text-base text-white border border-gray-200 rounded-full p-2 mb-2'
        onClick={() => setOpen(!open)}
      >
        Add New Address
      </button>

      <form onSubmit={handleSubmit} className={`w-full flex-between gap-2 ${open ? 'form active' : 'form inactive'}`}>
        <textarea
          name='new_address'
          value={addressInput}
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

export default Form
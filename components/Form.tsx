'use client'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

function Form() {
  const { data: session } = useSession()
  const [submitting, setSubmitting] = useState(false)
  const [address, setAddress] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    console.log('testing', address)

    setSubmitting(false)
  }


  return (
    <>

      <button
        className='w-1/3 text-center hover:bg-blue-400 transition duration-300 ease-in-out cursor-pointer font-satoshi font-semibold text-base text-white border border-gray-200 rounded-full p-2 mb-2'
        onClick={() => setOpen(!open)}
      >
        Add New Address
      </button>
      
      <form onSubmit={handleSubmit} className={`w-full flex-between gap-2 ${open ? 'form active' : 'form inactive'}`}>

        <input
          name='new_address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className='form_input border border-solid border-white focus:ring-2 focus:ring-blue-600 focus:border-transparent'
          placeholder='0x1234...'
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
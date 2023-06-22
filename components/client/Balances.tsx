'use client'
import { useEffect, useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Token } from '@/utils/types'
import { useSession } from 'next-auth/react'
import { CustomSession } from '@/utils/types'
import { getCombinedAccountData } from '@/utils/getTokens'

// Consider replacing the fetch calls to our endpoints with SERVER ACTIONS instead to reduce code and hopefully improve performance and resolve the flickering issue below.
// Also see `useTransition()` for improving client side submissions or using server side logic/functions on the client
// There's also 'use server' that I could add in a function within a client to make it server side if that improves performance (careful with leaking secrets though)
// Reference: https://youtu.be/pDtlal2-oEE

const GlobalBalances = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [addressInput, setAddressInput] = useState('')
  const [allTokens, setAllTokens] = useState<Token[]>([])

  const sortedByValue = useMemo(() => allTokens.sort((a, b) => b.quote - a.quote), [allTokens]);
  const totalUSD = useMemo(() => allTokens.reduce((acc, token) => acc + token.quote, 0), [allTokens]);

  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const fetchData = async () => {
    if (session && (session as CustomSession)?.user?.id) {
      console.log('active session:', session)

      try {
        const response = await fetch(`/api/tokens?user_id=${(session as CustomSession)?.user?.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        const res = await response.json();

        console.log('res:', res);
        setAllTokens(res.data);
      } catch (error: any) {
        console.log('Error fetching tokens:', error)
        throw Error('Something went wrong! We could not fetch your tokens.')
      }

    }
    if (!session) {
      console.log('no session');
      try {
        const localAccounts = localStorage.getItem('accounts');
        if (!localAccounts) {
          console.log('no local accounts');
          return;
        }
        const allTokens = await getCombinedAccountData(JSON.parse(localAccounts));
        //console.log('allTokens in fn:', allTokens);
        setAllTokens(allTokens);
      } catch (error: any) {
        console.log('Error finding local tokens:', error)
        throw Error('Something went wrong getting your token data!')
      }

    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!addressInput) return alert('Please enter an address')
    setSubmitting(true)

    try {
      // Extract addresses from the input using a regular expression
      const regex = /0x[a-fA-F0-9]{40}/g;
      const newAccounts: string[] = addressInput.match(regex) || [];

      // When logged in, save to DB
      if (session && (session as CustomSession)?.user?.id) {
        // Save to DB
        const res = await fetch('/api/accounts/new', {
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

          setSubmitting(false)
          alert('error:' + data.message[0]?.meta)
        } else {

          alert('Successfully added new addresses!')
        }
        setAddressInput('');

        //router.refresh()

        // When not logged in, save to localStorage
      } else {
        // Get saved accounts from localStorage
        const localAccounts = localStorage.getItem('accounts')

        // Compare localAccounts with accounts and update localStorage if needed
        if (!localAccounts) {
          localStorage.setItem('accounts', JSON.stringify(newAccounts))
        } else {
          JSON.parse(localAccounts || '[]').forEach((account: string) => {
            if (!newAccounts.includes(account)) {
              newAccounts.push(account)
            }
          })
          localStorage.setItem('accounts', JSON.stringify(newAccounts))
        }
        setSubmitting(false)
        setAddressInput('');
        await fetchData();
      }
    } catch (error: any) {
      console.log('Error saving tokens:', error)
      throw Error('Something went wrong saving your token data!')
    }

    //router.refresh()
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

      {/* update to try using server action (form action) */}
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


      <section className='w-full flex flex-col gap-4 mt-4'>
        <div className='flex-between border border-slate-400 rounded-xl p-4'>
          <h2 className='text-xl font-semibold text-slate-100'>
            Total USD
          </h2>
          <span className='orange_gradient text-xl font-bold'>
            ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
          </span>
        </div>

        {sortedByValue.map((token: Token, i) => (
          <Link key={token.contract_address + i} href={`/token/${token.contract_address}`}>
            <div className='flex-between border border-slate-400 rounded-xl p-4'>
              <div>
                <h2 className='text-xl font-semibold text-slate-100'>
                  {i += 1}. {token.contract_ticker_symbol} Balance
                </h2>
                <span className='flex-center gap-2 orange_gradient text-xl font-bold'>
                  <Image
                    alt='token-logo'
                    width={40}
                    height={40}
                    src={token.logo_url}
                    className='rounded-full'
                  />
                  {(parseInt(token.balance) / 10 ** token.contract_decimals).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 }) || 'N/A'}
                </span>
              </div>

              <div>
                <h2 className='text-xl font-semibold text-slate-100'>
                  {token.contract_ticker_symbol} Price
                </h2>
                <span className='orange_gradient text-xl font-bold'>
                  ${token.quote_rate && token.quote_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
                </span>
              </div>

              <div>
                <h2 className='text-xl font-semibold text-slate-100'>
                  Total Value
                </h2>
                <span className='orange_gradient text-xl font-bold'>
                  ${token.quote && token.quote.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  )
}

export { GlobalBalances }
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { BuiltInProviderType } from 'next-auth/providers'
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  ClientSafeProvider,
  LiteralUnion
} from 'next-auth/react'

// Replace the Image with new logo

const Nav = () => {
  const { data: session } = useSession()
  //console.log('session:', session)

  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)
  const [toggleDropdown, setToggleDropdown] = useState(false)

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getProviders()
      setProviders(response)
    }

    fetchProviders()
  }, [])

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <Link href='/' className='flex flex-center gap-2'>
        <Image
          src='/assets/images/logo.svg'
          alt='Placeholder Logo'
          width={30}
          height={30}
          className='object-contain'
        />
        <p className='logo_text'>Crypto HQ</p>
      </Link>

      {/* Desktop Nav */}
      <div className='sm:flex hidden'>
        {session?.user ? (
          <div className='flex gap-3 md:gap-5'>
            {/* <Link href='/create-prompt' className='black_btn'>
              Create Post
            </Link> */}

            <button type='button' onClick={() => signOut()} className='outline_btn'>
              Sign Out
            </button>

            <Link href='/profile'>
              <Image
                src={session?.user?.image || '/assets/images/logo.svg'}
                alt='Profile Picture'
                width={37}
                height={37}
                className='rounded-full'
              />
            </Link>
          </div>
        ) : (
          <>
            {providers && Object.values(providers).map((provider) => (
              <button
                type='button'
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className='black_btn'
              >
                Sign in with {provider.name}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Mobile Nav */}
      <div className='sm:hidden flex relative'>
        {session?.user ? (
          <div className='flex'>
            <Image
              src={session?.user?.image || '/assets/images/logo.svg'}
              alt='Profile Picture'
              width={37}
              height={37}
              className='rounded-full'
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              <div className='dropdown'>
                <Link
                  href='/profile'
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href='/create-prompt'
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <button
                  type='button'
                  onClick={() => {
                    setToggleDropdown(false)
                    signOut()
                  }}
                  className='mt-5 w-full black_btn'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers && Object.values(providers).map((provider) => (
              <button
                type='button'
                key={provider.name}
                onClick={() => { }}
                className='black_btn'
              >
                Sign in with {provider.name}
              </button>
            ))}
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav
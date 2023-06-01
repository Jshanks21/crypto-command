import 'server-only'
import Refresh from '@/components/Refresh'
import AllTokenDisplay from '@/components/AllTokenDisplay'
import Form from '@/components/Form'
import { Suspense } from 'react'

export default function Home() {
  return (
    <>
      <section className="w-3/4 flex-center flex-col">
        <h1 className="head_text text-center mb-10">
          Crypto Command HQ
        </h1>

        <Form />

        <Refresh className='mb-4' />
        <Suspense fallback={<div className='text-white'>Loading...</div>}>
          {/* @ts-expect-error Async Server Component */}
          <AllTokenDisplay />
        </Suspense>
      </section>
    </>
  )
}

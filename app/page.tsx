import 'server-only' 
import Balance from '@/components/Balance'

export default function Home() {
  return (
    <>
      <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center mb-10">
          Crypto Command HQ
        </h1>
          {/* @ts-expect-error Async Server Component */}
          <Balance />
      </section>      
    </>
  )
}

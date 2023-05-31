'use client'
import React from 'react'

// TODO: add alert for success/failure, loading, and animation for refresh
// update alert to be a toast notification
// TODO: add refresh button to each token?

function Refresh({ className }: { className?: string }) {

  const refreshTokenList = async () => {
    try {
      await fetch('/api/tokens/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

    } catch (error) {
      console.log(error)
      throw Error('Something went wrong!')
    }
  }

  return (
    <div>
      <div className='cursor-pointer' onClick={() => refreshTokenList()}>
        <svg
          className={`w-5 h-5 fill-current text-white ${className}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512.002 512.002">
          <path d="M436.866 436.871C485.178 388.56 511.787 324.325 511.787 256 511.787 114.961 397.043.215 256.004.214v49.507C369.745 49.723 462.28 142.26 462.28 256c0 55.101-21.458 106.902-60.42 145.864l-7.571 7.571-67.552-67.552.021 170.076 170.096.041-67.559-67.559 7.571-7.57zM49.724 256.001c0-55.101 21.458-106.902 60.42-145.864l7.571-7.571 67.552 67.552L185.245.041 15.148 0l67.559 67.559-7.571 7.57C26.824 123.439.215 187.674.215 255.999c0 141.039 114.744 255.785 255.783 255.786v-49.507c-113.74 0-206.274-92.536-206.274-206.277z" />
        </svg>
      </div>
    </div>

  )
}

export default Refresh
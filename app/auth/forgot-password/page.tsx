import React from 'react'
import ForgotPassword from './ForgotPassword'
import Navbar from '@/app/components/Navbar'

const page = () => {
  return (
    <>
    <Navbar showFilters={false} />
    <main><ForgotPassword/></main>

    </>
  )
}

export default page
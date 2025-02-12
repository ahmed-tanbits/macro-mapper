import React from 'react'
import LogIn from './LogIn'
import Navbar from '@/app/components/Navbar'

const page = () => {
  return (
    <>
      <Navbar showFilters={false} />
      <main><LogIn /></main>
    </>

  )
}

export default page
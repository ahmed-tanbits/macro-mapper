import React from 'react'
import Signup from './SignUp'
import Navbar from '@/app/components/Navbar'
import Toast from '@/app/components/Toast'


const Authendication = () => {
  return (
    <>
      <Navbar showFilters={false} />
      <Signup />
      <Toast />
    </>
  )
}

export default Authendication

"use client";
import React from 'react'
import Signup from './SignUp'
import Navbar from '@/app/components/Navbar'
import Toast from '@/app/components/Toast'
import withAuthRedirect from '@/app/hoc/withAuthRedirect'

const Authendication = () => {
  return (
    <>
      <Navbar showFilters={false} />
      <Signup />
      <Toast />
    </>
  )
}

export default withAuthRedirect(Authendication);


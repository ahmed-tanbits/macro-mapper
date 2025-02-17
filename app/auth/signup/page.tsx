"use client";
import React from 'react'
import Signup from './SignUp'
import Navbar from '@/app/components/Navbar'
import withAuthRedirect from '@/app/hoc/withAuthRedirect'

const Authendication = () => {
  return (
    <>
      <Navbar showFilters={false} />
      <Signup />
    </>
  )
}

export default withAuthRedirect(Authendication);


'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
const navbar = () => {
    const {data:session} = useSession()

    // we cant use data.user as this data only have status and stuff it is only us who include user data in session while adjusting jwt  
    const user:User = session?.user
  return (
    <nav>
        
    </nav>
  )
}

export default navbar
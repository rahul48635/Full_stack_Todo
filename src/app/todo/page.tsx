
import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Todos from '@/components/Todo'


export default async function Todo() {
    const session=await getServerSession(authOptions)
    if(!session?.user){
        return (
        <div>
          Route is not Available
        </div>
        )
    }
  return (
    <div>
      <Todos/>
    </div>
  )
}

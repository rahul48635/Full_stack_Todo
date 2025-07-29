import React from 'react'
import { useEffect, useState } from 'react'
import { signOut,signIn, useSession } from "next-auth/react";
import Image from 'next/image';

export default function Appbar() {
    const {data:Session,status}=useSession()
    const [authenticated,setAuthenticated]=useState<boolean>(false)
    const [user, setUser] = useState<null | undefined | { name?: string | null, email?: string | null, image?: string | null }>({})


    useEffect(()=>{
        if(status==="authenticated"){
            setAuthenticated(true)
            setUser(Session?.user)
        }
    },[status])


  return (
    <div className="w-full bg-blue-700 absolute top-0 flex items-center justify-between rounded-b-2xl h-20 bg-gradient-to-r from-gray-600 to-blue-800 p-6">
       {user?.image && <div className='flex gap-5'>
            <Image src={`${user?.image}`} alt="test image" width={50} height={50} className='rounded-full'/>
            <span className='bg-black/20 text-center rounded-2xl items-center flex text-white p-2'>{user?.name}</span>
        </div>}
        <div className='flex justify-center items-center gap-10 '>
            {authenticated || <button className="rounded-2xl text-white bg-black px-5 py-1 cursor-pointer relative right-5" onClick={()=>signIn()}>Signin</button>}
            {authenticated && <button className="rounded-2xl text-white bg-black px-5 py-1 cursor-pointer relative right-5" onClick={()=>signOut()}>Signout</button>}
        </div>
    </div>
  )
}

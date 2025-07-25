"use client"
import axios from "axios";
import { useState } from "react";
import { signOut,signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Home() {
  const [user,setUser]=useState('')
  const [password,setPassword]=useState('')
   const handleClick=(username:string,password:string)=>{
    axios.post('http://localhost:3000/api/user',{
      username:username,
      password:password
    })
   }
  return (
    <div className="font-sans  min-h-screen min-w-screen p-5">
      <div className="flex items-center justify-center gap-5">
      <input type="text"  placeholder="username" className="rounded-2xl p-5 border-2 border-gray-600" onChange={(e)=>setUser(e.target.value)}/>
      <input type="text"  placeholder="password" className="rounded-2xl p-5 border-2 border-gray-600" onChange={(e)=>setPassword(e.target.value)}/>
      </div>
      <div className="m-5 w-full flex items-center justify-center">
        <button className="rounded-2xl text-white bg-black px-5 py-1 cursor-pointer relative right-5" onClick={()=>handleClick(user,password)}>submit</button>
        <button className="rounded-2xl text-white bg-black px-5 py-1 cursor-pointer relative right-5" onClick={()=>signIn()}>Signin</button>
        <button className="rounded-2xl text-white bg-black px-5 py-1 cursor-pointer relative right-5" onClick={()=>signOut()}>Signout</button>
        <span className="rounded-2xl text-white bg-black px-5 py-1 cursor-pointer relative right-5">{JSON.stringify(useSession)}</span>
      </div>
    </div>
  );
}

'use client'

import Appbar from "@/components/Appbar"


export default function Home() {

  return (
    <div className="font-sans  h-screen w-screen relative">
      <Appbar/>
      <div className="min-w-full min-h-full flex items-center justify-center text-4xl">
          Home page
      </div>
    </div>
  )
}

'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce';
type Todo = {
  title: string;
  description: string;
  // Add other fields as needed, e.g. id?: string;
};

export default function Todos() {
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [data,setData]=useState<Todo[]>([])
  const [refreshCount,setRefreshCount]=useState(0)
  const handleSubmit = async () => {
  try {
    const res = await axios.post(
      '/api/createTodos',
      { title, description },
    );
    const data = res.data;
    if (data.error) {
      alert(data.error || 'Something went wrong');
    } else {
      alert(data.message);
      setRefreshCount(prev=>prev+1)
    }
  } catch (err) {
    alert('Request failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
};

   const debouncedhandle=useDebouncedCallback(()=>{
    handleSubmit()
   },1000) 

    useEffect(()=>{
      const fetchdata=async()=>{
      try{const res=await axios.get('/api/getTodos')
      const data = await res.data;
      setData(data)
        if (data.error) {
          alert(data.error || 'Something went wrong');
        } else {
          alert('data arrived');
        }} catch (err) {
        alert('Request failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }}
      fetchdata()
    },[refreshCount])

  return (
    <div>
      <div className='flex flex-col w-1/2 self-center justify-self-center gap-5'>
        <label htmlFor="Title"></label>
        <input type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)} className='border-2 rounded-3xl p-5' />
        <label htmlFor="Description"></label>
        <input type="text" placeholder='Description' onChange={(e)=>setDescription(e.target.value)} className='border-2 rounded-3xl p-5' />
        <button onClick={debouncedhandle} className='bg-black rounded-2xl text-white cursor-pointer  self-center px-5'>Submit</button>
      </div>
      <div>
        <div className='flex flex-col gap-5 mt-5'>
        <h1 className='self-center text-5xl'>Todos</h1>
          {data?.map((item,idx)=>(
            <div key={idx} className='bg-black text-white text-center gap-5 flex items-center justify-around h-20 rounded-2xl mx-5'>
              {idx+1}.
              <label htmlFor="title">title</label>
              <p>{item.title}</p>
              <label htmlFor="description">description</label>
              <p>{item.description}</p>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

"use client"
import axios from "axios";
import { FormEvent } from "react";
export default function Home() {

  const config = {
    headers: {
      Authorization:
        `Bearer ${process.env.TOKEN}`,
    },
  }; 

  
  const getdata = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const data = axios.get(
      `https://api.twitter.com/2/users/by/username/${formData.get("username")}`,
      config
    );
    console.log(data)
  }


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <form onSubmit={(e)=>getdata(e)}>
        <input type="text" name="username" />
        <button type="submit">click</button>
      </form>
    </div>
  );
}

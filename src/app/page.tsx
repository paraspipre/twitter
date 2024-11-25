
"use client"
import axios from "axios";

export default  function Home() {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getdata = async (e:any) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const data = await axios.get(
      `https://chillguyanalyser.vercel.app/api?username=${formData.get(
        "username"
      )}`
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

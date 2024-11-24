
// import axios from "axios";
import { Client } from "twitter-api-sdk";

export default  function Home() {

  const client = new Client(process.env.NEXT_PUBLIC_TOKEN as string);
  // const config = {
  //   headers: {
  //     Authorization: process.env.NEXT_PUBLIC_TOKEN,
  //   },
  // };

  const getdata = async () =>{

    const response = await client.tweets.usersIdTweets("elonmusk");
    console.log("response", response);
  }

getdata()

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const getdata = async (e:any) => {
  //   e.preventDefault()
  //   const formData = new FormData(e.target);
  //   // const data = axios.get(
  //   //   `https://api.twitter.com/2/users/by/username/${formData.get("username")}`,
  //   //   config
  //   // );
  //   // console.log(data)

  //   const response = await client.tweets.usersIdTweets(formData.get("username") as string);

  //   console.log("response", JSON.stringify(response, null, 2));
  // }


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <form onSubmit={(e)=>getdata(e)}>
        <input type="text" name="username" />
        <button type="submit">click</button>
      </form> */}
    </div>
  );
}

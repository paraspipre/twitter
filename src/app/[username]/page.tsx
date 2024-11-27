"use client";
import axios from "axios";
// import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { useCallback, useEffect, useState } from "react";
// import { ChatPromptTemplate} from "@langchain/core/prompts";
// import { LLMChain } from "langchain/chains";
import Image from "next/image";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export default function Page({ params }:{params:{username:string}}) {
   const username = params.username
  const [result, setResult] = useState("");
  const [user, setUser] = useState({
    name: "",
    username: "",
    img: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getdata = useCallback(async () => {
    setResult("");
    const { data } = await axios.post(`/api`, { username });
    const tweets: string = data.tweets;
    console.log(data.tweets);
     setUser(data.user);
     

     const emotion = "😡"
     
      const response = await axios.post("/api/ai", { tweets, emotion });
      setResult(response.data.airesult);

   //   const llm = new HuggingFaceInference({
   //     model: "mistralai/Mixtral-8x7B-Instruct-v0.1", //meta-llama/Llama-3.2-1B //mistralai/Mixtral-8x7B-Instruct-v0.1 //meta-llama/Meta-Llama-3-8B-Instruct
   //     apiKey: process.env.NEXT_PUBLIC_HF_TOKEN, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
   //     // maxTokens: 1500,
   //     // temperature: 0.8,
   //     // topP: 0.95,
   //   });

   //  const chainRef = new LLMChain({
   //    llm,
   //    prompt: ChatPromptTemplate.fromMessages([
   //      [
   //        "system",
   //        `You are an outrageously sarcastic AI judge who cracks witty, borderline savage jokes based on people&apos;s tweets. Roast people in a hilariously exaggerated, razor-sharp, and satirical way that leaves them feeling 😡. Be creatively expressive, with a touch of audacious humor, and make comparisons to famous movie characters or real-life figures to elevate the comedy.`,
   //      ],
   //      ["user", "{input}"],
   //    ]),
   //  });

   //  const resdata = await chainRef?.invoke(
   //    {
   //      input: tweets,
   //    }
   //  );
   //  console.log(resdata.text);
   //  setResult(resdata.text)
    // setResult(resdata.text.split(':')[1])
    // if(result?.length < 1) setResult("Something is went wrong try changing emotion level")
    
   },[username])
   
   useEffect(() => {
     getdata();
   }, [ getdata]);

  return (
    <div
      className={`flex flex-col items-center p-10 w-full min-h-screen gap-4 bg-gray-300 text-black ${poppins.className}`}
    >
      <div className="flex items-center gap-10 w-70%">
        <div>
          <Image src="/X.png" width={75} height={75} alt="logo" />
        </div>
        <div className={`text-[2rem]   md:text-[3rem] `}>Roast Alert!⚠️</div>
      </div>
      <div className="text-[1rem]">
        oh you Narcisist! Always wanted to know what everyone is thinking about
        you?
      </div>

      {result && (
        <div className="flex flex-col  justify-center border p-6 rounded-3xl w-full md:w-[600px] gap-6 bg-purple-300">
          <div>
            <div className="border-b pb-4 mb-4 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="rounded-full">
                  <Image
                    className="rounded-full"
                    src={user.img}
                    width={50}
                    height={50}
                    alt="logo"
                  />
                </div>
                <div>
                  <div className="text-purple-900 font-bold text-xl">
                    {user.name}
                  </div>
                  <div>{user.username}</div>
                </div>
              </div>
                    <Link
                       href={`/`}
                className="w-fit p-2 rounded-xl bg-purple-500  flex items-center justify-center"
               
              >
                Roast your tweets
              </Link>
            </div>

            <div>{result}</div>
            <div className="border-t mt-4 pt-4 text-sm">
              {" "}
              Rosted by https://xroast.vercel.app
            </div>
            <div className="text-sm"> Made with ❤️ by @ParasPipre </div>
          </div>
        </div>
      )}
    </div>
  );
}

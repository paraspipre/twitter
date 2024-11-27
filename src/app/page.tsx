
"use client"
import axios from "axios";
// import { HuggingFaceInference } from "@langchain/community/llms/hf";
import {  useRef, useState } from "react";
// import { ChatPromptTemplate} from "@langchain/core/prompts";
// import { LLMChain } from "langchain/chains";
import EmotionSlider from "./components/EmotionSlider";
import Image from "next/image";
import { Poppins } from "next/font/google";
import html2canvas from "html2canvas";
import { ArrowDownToLine, Loader } from "lucide-react";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });


export default function Home() {
  const [result, setResult] = useState("")
   const emotions = ["😍","😊" ,"😐","😒","😡" ];
  const [emotion, setEmotion] = useState<string>("😡");
  const [user, setUser] = useState({
    name: "",
    username: "",
    img:""
  })

  const [loading,setLoading] = useState(false)
  const handleSliderChange = (selectedEmotion: string) => {
    console.log("Selected Emotion:", selectedEmotion);
    setEmotion(selectedEmotion)
  };
  
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getdata = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setResult("")
    const formData = new FormData(e.target);
    const username = formData.get("username")
    const {data} = await axios.post(`/api`,{username});
    const tweets:string = data.tweets;
    console.log(data.tweets)
    setUser(data.user)

    const response =  await axios.post("/api/ai",{tweets,emotion})

    setResult(response.data.airesult);

    // const llm = new HuggingFaceInference({
    //   model: "mistralai/Mixtral-8x7B-Instruct-v0.1", //meta-llama/Llama-3.2-1B //mistralai/Mixtral-8x7B-Instruct-v0.1 //meta-llama/Meta-Llama-3-8B-Instruct
    //   apiKey: process.env.NEXT_PUBLIC_HF_TOKEN, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
    //   // maxTokens: 1500,
    //   // temperature: 0.8,
    //   // topP: 0.95,
    // });

    // const chainRef = new LLMChain({
    //   llm,
    //   prompt: ChatPromptTemplate.fromMessages([
    //     [
    //       "system",
    //       `You are an outrageously sarcastic AI judge who cracks witty, borderline savage jokes based on people&apos;s tweets. Roast people in a hilariously exaggerated, razor-sharp, and satirical way that leaves them feeling ${emotion}. Be creatively expressive, with a touch of audacious humor, and make comparisons to famous movie characters or real-life figures to elevate the comedy.`,
    //     ],
    //     ["user", "{input}"],
    //   ]),
    // });
    
    // const resdata = await chainRef?.invoke(
    //   {
    //     input: tweets,
    //   }
    // );
    // console.log(resdata.text);
    // setResult(resdata.text)
    // setResult(resdata.text.split(':')[1])
    // if(result?.length < 1) setResult("Something is went wrong try changing emotion level")
    
    setLoading(false)
  }

  const divRef = useRef<HTMLDivElement>(null);
  const [imageURL, setImageURL] = useState(false);

  const download = async () => {
    if (!divRef.current) return;
    setImageURL(true)

    // Use html2canvas to capture the div
    const canvas = await html2canvas(divRef.current, {
      scale: 2, // Higher resolution
      useCORS: true, // To handle cross-origin images
    });

    // Convert the canvas to a blob URL
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob))
    );

    if (blob) {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" }, // Specify the content type
        body: blob, // Send the blob as the request body
      });
      const data = await response.json();
      console.log("Uploaded URL:", data.url);
      setImageURL(data.url);
      const a = document.createElement("a");
      a.href = data.url as string;
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "_");
      a.download = `xroast${timestamp}.png`;
      a.click();
    }
    setImageURL(false)
  };

  const shareOnTwitter = () => {
    const twitterURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      `https://xroast.vercel.app/${user.username}` as string
    )}&text=${encodeURIComponent(
      "Check out this cool free AI Tweet Roaster🗿🗿."
    )}`;
    window.open(twitterURL, "_blank");
  };

  
  return (
    <div
      className={`flex flex-col items-center pt-10 p-2 sm:p-10 w-full min-h-screen gap-4 bg-gray-300 text-black ${poppins.className}`}
    >
      <div className="flex items-center gap-10 w-70%">
        <div>
          <Image src="/X.png" width={75} height={75} alt="logo" />
        </div>
        <div className={`text-[2rem]   sm:text-[3rem] `}>Roast Alert!⚠️</div>
      </div>
      <div className="text-[1rem]">
        oh you Narcisist! Always wanted to know what everyone is thinking about
        you?
      </div>
      <form
        className="flex flex-col items-start   justify-center border p-4 sm:p-10 rounded-3xl w-full sm:w-[600px] gap-6 bg-slate-200"
        onSubmit={(e) => getdata(e)}
      >
        <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between w-full">
          <div className="text-[1rem]">X username : </div>
          <input
            className="border rounded-xl p-2 focus:outline-none bg-slate-100"
            type="text"
            name="username"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between w-full">
          <div className="">Set emotion : </div>
          <EmotionSlider
            labels={emotions}
            initialIndex={4} // Default to "Neutral"
            onChange={handleSliderChange}
          />
        </div>
        <button
          className="w-full p-2 rounded-xl bg-purple-500  flex items-center justify-center"
          type="submit"
        >
          {loading ? "Wait" : "Click now Lazy!"}
        </button>
      </form>
      {result && (
        <div
          ref={divRef}
          className="flex flex-col  justify-center border p-6 rounded-3xl w-full sm:w-[600px] gap-6 bg-purple-300"
        >
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
              <div className="flex gap-2">
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center justify-center gap-2 p-3 bg-purple-800 w-fit rounded-[12px] text-white"
                >
                  <div> Share on </div>{" "}
                  <div className="w-[15px] h-[15px]">
                    {" "}
                    <Image
                      src="/X.png"
                      alt="logo1"
                      width={15}
                      height={15}
                    />{" "}
                  </div>
                </button>
                <button
                  onClick={download}
                  className="flex items-center justify-center gap-2 p-3 bg-purple-800 w-fit rounded-[12px] text-white"
                >
                  {imageURL ? <Loader /> : <ArrowDownToLine />}
                </button>
              </div>
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

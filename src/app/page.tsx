
"use client"
import axios from "axios";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import {  useRef, useState } from "react";
import { ChatPromptTemplate} from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import EmotionSlider from "./components/EmotionSlider";
import Image from "next/image";
import { Poppins, Sour_Gummy } from "next/font/google";
import html2canvas from "html2canvas";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

const sour_Gummy = Sour_Gummy({ subsets: ["latin"]});

export default function Home() {
  const [result, setResult] = useState("")
   const emotions = ["😍","😊" ,"😐","😒","😡" ];
  const [emotion, setEmotion] = useState("😡");
  const [tweet, setTweet] = useState("")
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
  
  const llm = new HuggingFaceInference({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1", //meta-llama/Llama-3.2-1B //mistralai/Mixtral-8x7B-Instruct-v0.1 //meta-llama/Meta-Llama-3-8B-Instruct
    apiKey: process.env.NEXT_PUBLIC_HF_TOKEN, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
    // maxTokens: 1500,
    // temperature: 0.8,
    // topP: 0.95,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getdata = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setResult("")
    const formData = new FormData(e.target);
    const username = formData.get("username")
    const {data} = await axios.post(`/api/tweets`,{username});
    const tweets = data.tweets;
    console.log(data.tweets)
    setUser(data.user)

    const chainRef = new LLMChain({
      llm,
      prompt: ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are an outrageously sarcastic AI judge who cracks witty, borderline savage jokes based on people's tweets. Roast people in a hilariously exaggerated, razor-sharp, and satirical way that leaves them feeling ${emotion}. Be creatively expressive, with a touch of audacious humor, and make comparisons to famous movie characters or real-life figures to elevate the comedy.`,
        ],
        ["user", "{input}"],
      ]),
    });
    
    const resdata = await chainRef?.invoke(
      {
        input: tweets,
      }
    );
    console.log(resdata.text);
    setResult(resdata.text)
    // setResult(resdata.text.split(':')[1])
    // if(result?.length < 1) setResult("Something is went wrong try changing emotion level")
    captureImage()
    setLoading(false)
  }

  const divRef = useRef<HTMLDivElement>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const captureImage = async () => {
    if (!divRef.current) return;

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
      const url = URL.createObjectURL(blob);
      setImageURL(url); // Save the blob URL to share on Twitter
    }
  };

  const shareOnTwitter = () => {
    captureImage();
    if (!imageURL) return;

    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      "Roasted by https://twitter-ten-inky.vercel.app !"
    )}&url=${encodeURIComponent(imageURL)}`;
    window.open(twitterURL, "_blank");
  };


  return (
    <div
      className={`flex flex-col items-center p-10 w-full min-h-screen gap-4 bg-gray-300 text-black ${poppins.className}`}
    >
      <div className="flex items-center gap-10 w-70%">
        <div>
          <Image src="/X.png" width={75} height={75} alt="logo" />
        </div>
        <div className={`text-[2rem]   md:text-[3rem] ${sour_Gummy.className}`}>
          Roast Alert!⚠️
        </div>
      </div>
      <div className="text-[1rem]">
        oh you Narcisist! Always wanted to know what everyone is thinking about
        you?
      </div>
      <form
        className="flex flex-col  justify-center border p-10 rounded-3xl w-full md:w-[600px] gap-6 bg-slate-200"
        onSubmit={(e) => getdata(e)}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-[1rem]">Lazy Ass! Enter you X username : </div>
          <input
            className="border rounded-xl p-2 m-4 focus:outline-none bg-slate-100"
            type="text"
            name="username"
          />
        </div>
        <div className="flex gap-2 md:gap-0 flex-col md:flex-row items-center justify-between">
          <div className="">Can't take criticism? set the emotion : </div>
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
          {loading ? "Wait" :"Click now Lazy!"}
        </button>
      </form>
      {result && (
        <div
          ref={divRef}
          className="flex flex-col  justify-center border p-6 rounded-3xl w-full md:w-[600px] gap-6 bg-purple-300"
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
                  <div className="text-purple-900 font-bold text-xl">{user.name}</div>
                  <div>{user.username}</div>
                </div>
              </div>
              <button
                onClick={shareOnTwitter}
                className="flex items-center justify-center gap-2 p-3 bg-purple-800 w-fit rounded-[12px] text-white"
              >
                <div> Share on </div>{" "}
                <div className="w-[15px] h-[15px]">
                  {" "}
                  <Image src="/X.png" alt="logo1" width={15} height={15} />{" "}
                </div>
              </button>
            </div>

            <div>
              {result}
            </div>
            <div className="border-t mt-4 pt-4 text-sm">
              {" "}
              Rosted by https://twitter-ten-inky.vercel.app
            </div>
            <div className="text-sm"> Made with ❤️ by @ParasPipre </div>
          </div>
        </div>
      )}
    </div>
  );
}

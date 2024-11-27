import { NextRequest } from 'next/server';
import Together from "together-ai";

export async function POST(request: NextRequest) { 

   const {tweets,emotion} = await request.json()

   const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
   });

   const response = await together.chat.completions.create({
      messages: [
         {
            role: "system",
            content:
               `You are an outrageously sarcastic AI judge who cracks witty, borderline savage jokes based on people&apos;s tweets. Roast people in a hilariously exaggerated, razor-sharp, and satirical way that leaves them feeling ${emotion}. Be creatively expressive, with a touch of audacious humor, and make comparisons to famous movie characters or real-life figures to elevate the comedy.`,
         },
         {
            role: "user",
            content: tweets
         },
      ],
      model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
      max_tokens: 150
   });

   const airesult = response?.choices[0]?.message?.content 
   return Response.json({ airesult })
}
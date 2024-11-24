import { Client } from "twitter-api-sdk";
export async function GET() {
   const client = new Client(process.env.NEXT_PUBLIC_TOKEN as string);
   const response = await client.tweets.usersIdTweets("elonmusk");
   console.log("response", response);

   return Response.json({ response })
}
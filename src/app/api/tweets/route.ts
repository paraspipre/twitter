
import axios from 'axios';
import { NextRequest } from 'next/server';
export async function POST(request: NextRequest) {
   const { username } = await request.json();

   const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`;

   try {
      const response = await axios.get(url);
      const html = response.data;

      const startStr = '<script id="__NEXT_DATA__" type="application/json">';
      const endStr = '</script>';

      const startIndex = html.indexOf(startStr) + startStr.length;
      const endIndex = html.indexOf(endStr, startIndex);

      if (startIndex === -1 || endIndex === -1) {
         // Handle cases where the start or end string is not found
         console.error('Could not find the JSON data within the HTML response.');
         return undefined;
      }

      const jsonStr = html.substring(startIndex, endIndex);
      const data = JSON.parse(jsonStr);

      // Accessing the tweet text, handling potential undefined values
      const entries = data?.props?.pageProps?.timeline?.entries;
      let tweets 
      let n=0
      while (n < 50) {
         if (n >= entries.length) break
         const firstEntry = entries?.[n];
         const tweetContent = firstEntry?.content?.tweet;
         const fullText = tweetContent?.full_text;
         tweets = tweets + " " + fullText
         n++
      }

      const user = {
         name: data?.props?.pageProps?.timeline?.entries[0].content?.tweet.user.name,
         username:data?.props?.pageProps?.timeline?.entries[0].content?.tweet.user.screen_name,
         img:data?.props?.pageProps?.timeline?.entries[0].content?.tweet.user.profile_image_url_https,
      }

      const urlRegex = /(https?:\/\/[^\s]+)/g;

      tweets = tweets?.replace(urlRegex, "").trim();

      return Response.json({ tweets , user });
   } catch (error) {
      console.error('Error fetching or parsing tweet data:', error);
      return undefined;
   }
}
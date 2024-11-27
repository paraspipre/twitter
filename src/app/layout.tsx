import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "X roast",
  description: "Roast X users",
  openGraph: {
    title: "X roast",
    description: "Roast X users",
    images: [
      {
        url: "https://imgur.com/9toOgeo.png",
        alt: "img",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "X roast",
    description: "Roast X users",
    images: ["https://imgur.com/9toOgeo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

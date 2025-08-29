import type React from "react"
import type { Metadata } from "next"
import { Dancing_Script, Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner" // Import Sonner Toaster

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dancing-script",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Chá de Bebê do Lucca",
  description: "Celebre conosco a chegada do nosso pequeno Lucca!",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${dancingScript.variable} ${poppins.variable} antialiased`}>
      <body>
        {children}
        <Toaster /> {/* Add the Toaster component here */}
      </body>
    </html>
  )
}
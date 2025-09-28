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
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤎</text></svg>",
  },
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
import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollToTop } from "@/components/ui/ScrollAnimations"
import ThemeToggle from "@/components/ThemeToggle"
import ToastProvider from "@/components/Toast"
import ClickSoundProvider from "@/components/ClickSoundProvider";
import DevtoolsMeme from "@/components/DevtoolsMeme";

const hkGrotesk = Hanken_Grotesk({
  weight: ['400'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-hk-grotesk',
  display: 'swap',
})


const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-instrument-serif'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aash7.xyz'),
  title: 'Ankesh Singh',
  description: 'I build products that solve real problems. Available for new opportunities.',
  openGraph: {
    url: 'https://aash7.xyz/',
    siteName: 'Ankesh Singh Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: '/open-graph.png',
      width: 1200,
      height: 630,
      alt: 'Ankesh Singh - Portfolio'
    }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="tMCNs2fgM6voEHBd3JsySffMFSiUCQDEFEF1iYI3-ZQ" />
      </head>
      <body className={`${hkGrotesk.className} ${instrumentSerif.variable}`} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative z-10">
            {children}
          </div>
          <ThemeToggle />
          <ScrollToTop />
          <ToastProvider />
          <ClickSoundProvider />
          <DevtoolsMeme />
        </ThemeProvider>
    
      </body>
    </html>
  );
}

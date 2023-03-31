import '@/styles/globals.css'
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight:["400", "500", "600", "700", "800", "900"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className} >
      <Component {...pageProps} />
    </main>
  )
}

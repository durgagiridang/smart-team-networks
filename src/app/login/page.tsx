'use client'
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // यदि युजर पहिले नै लगइन छ भने उसलाई होमपेजमा पठाइदिने
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F0F0F]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F0F0F] text-white p-6">
      {/* Logo Section */}
      <h1 className="text-5xl font-black italic tracking-tighter text-cyan-500 mb-2">
        STN
      </h1>
      <p className="text-gray-400 text-xs tracking-[0.5em] mb-12 uppercase">Networks</p>
      
      {/* Login Card */}
      <div className="bg-gradient-to-b from-white/10 to-transparent p-10 rounded-[40px] border border-white/10 backdrop-blur-xl shadow-2xl text-center w-full max-w-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-black italic">SWAAGAT CHA!</h2>
          <p className="text-gray-500 text-sm mt-1">Smart Team Networks मा लगइन गर्नुहोस्</p>
        </div>

        <button 
          // यहाँ मुख्य सुधार गरिएको छ: prompt: "select_account" थपिएको छ
          onClick={() => signIn('google', { 
            callbackUrl: '/', 
            prompt: 'select_account' 
          })}
          className="flex items-center justify-center gap-4 bg-white text-black w-full py-4 rounded-2xl font-black hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.1)] group"
        >
          <img src="https://www.google.com/favicon.ico" alt="google" className="w-5 h-5 group-hover:scale-125 transition-transform" />
          CONTINUE WITH GOOGLE
        </button>

        <div className="mt-10 pt-8 border-t border-white/5">
          <p className="text-cyan-500 font-black italic text-sm tracking-widest uppercase">
            "Nepali ko Sath Nepali kai Bikash"
          </p>
        </div>
      </div>

      <p className="mt-8 text-gray-700 text-[10px] font-bold tracking-widest uppercase">
        Smart Team Networks v1.2
      </p>
    </div>
  )
}
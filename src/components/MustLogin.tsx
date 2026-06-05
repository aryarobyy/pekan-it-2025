import React, { useEffect } from 'react'
import { MyButton } from './Button'
import { useNavigate } from 'react-router'

const MustLogin = () => {
  const navigate = useNavigate()

  useEffect(() => { //no scroll brooo
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto' 
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg px-6 py-8 text-center max-w-sm w-full">
        <h1 className="text-lg font-semibold mb-4">Kamu harus login untuk lanjut</h1>
        <MyButton 
          text="Kembali ke dashboard"
          onClick={() => navigate("/")}
          variant="accent"
        />
      </div>
    </div>
  )
}

export default MustLogin

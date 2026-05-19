import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
          navigate('/signin')
          return
        }

        navigate('/dashboard')
      } catch {
        navigate('/signin')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'Geist Variable, sans-serif',
        background: '#fff',
        color: '#0f172a',
      }}
    >
      Signing you in...
    </div>
  )
}
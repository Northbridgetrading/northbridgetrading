import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  // ✅ balanced input (not full underline anymore)
  const inputStyle = {
    width: '100%',
    padding: '0.85rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: '0.2s ease',
  }

  const focusStyle = {
    border: '1px solid var(--color-primary)',
    boxShadow: '0 0 0 2px rgba(0,0,0,0.04)',
  }

  const socialBtn = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '999px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    cursor: 'pointer',
    fontSize: '0.9rem',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        background: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem 2rem',
        }}
      >
        {/* HEADER */}
        <h1
          style={{
            textAlign: 'center',
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '2rem',
          }}
        >
          Sign in
        </h1>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
        >
          {/* EMAIL */}
          <div>
            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              style={inputStyle}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>
              Password
            </label>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                style={{ ...inputStyle, paddingRight: '3rem' }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>

            {/* Forgot */}
            <div style={{ marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>
          </div>

          {/* CHECKBOX */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <input type="checkbox" />
            Keep me logged in for 30 days
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '1.2rem',
              padding: '0.85rem',
              borderRadius: '999px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-primary)',
              color: 'black',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* DIVIDER */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.8rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <span style={{ margin: '0 1rem', fontSize: '0.75rem' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        </div>

        {/* SOCIAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button style={socialBtn}>Sign in with Google</button>
          <button style={socialBtn}>Sign in with Apple</button>
          <button style={socialBtn}>Sign in with Facebook</button>
        </div>

        {/* FOOTER */}
        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '2rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ fontWeight: '600' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
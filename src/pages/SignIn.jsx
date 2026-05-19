import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

import { FcGoogle } from 'react-icons/fc'
import { FaApple, FaFacebook } from 'react-icons/fa'

const EyeIcon = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
)

export default function SignIn() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    try {
      setLoading(true)

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) throw signInError

      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignIn = async (provider) => {
    try {
      setLoading(true)
      setError('')

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err.message || 'Social sign-in failed.')
      setLoading(false)
    }
  }

  const socialProviders = [
    {
      id: 'google',
      label: 'Sign in with Google',
      Icon: FcGoogle,
    },
    {
      id: 'apple',
      label: 'Sign in with Apple',
      Icon: FaApple,
    },
    {
      id: 'facebook',
      label: 'Sign in with Facebook',
      Icon: FaFacebook,
    },
  ]

  const TEXT = '#0f172a'
  const MUTED = '#64748b'
  const BORDER = '#d6dbe7'
  const PRIMARY = '#1E4A7C'

  return (
    <>
      <style>{`
        .si-root {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 4rem 1rem;
          background: #eef1f7;
          font-family: 'Geist Variable', ui-sans-serif, system-ui;
        }

        .si-card {
          width: 100%;
          max-width: 500px;
          padding: 2.5rem 2rem;
          background: #fff;
          border-radius: 22px;
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.08),
            0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .si-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 500;
          margin-bottom: 2.4rem;
          color: ${TEXT};
        }

        .si-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .si-label {
          font-size: 0.74rem;
          font-weight: 600;
          text-transform: uppercase;
          color: ${MUTED};
          margin-bottom: 0.5rem;
          display: block;
        }

        .si-input {
          width: 100%;
          padding: 0.9rem 0;
          border: none;
          border-bottom: 1.5px solid ${BORDER};
          font-size: 1rem;
          outline: none;
          background: transparent;
          color: ${TEXT};
        }

        .si-input:focus {
          border-bottom-color: ${PRIMARY};
        }

        .si-pw-wrap {
          position: relative;
        }

        .si-eye {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: ${MUTED};
        }

        .si-forgot {
          margin-top: 1rem;
          background: none;
          border: none;
          color: ${PRIMARY};
          cursor: pointer;
          font-size: 0.9rem;
        }

        .si-submit {
          width: 100%;
          height: 54px;
          border-radius: 999px;
          border: none;
          background: ${PRIMARY};
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }

        .si-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0 1.5rem;
        }

        .si-divider-line {
          flex: 1;
          height: 1px;
          background: ${BORDER};
        }

        .si-divider-text {
          font-size: 0.8rem;
          color: ${MUTED};
        }

        .si-social-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .si-social-btn {
          width: 100%;
          height: 52px;
          border-radius: 999px;
          border: 1px solid ${BORDER};
          background: #fff;
          color: #111;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .si-social-btn:hover {
          background: #f8fafc;
        }

        .si-footer {
          margin-top: 2rem;
          text-align: center;
          color: ${MUTED};
        }

        .si-footer a {
          color: ${PRIMARY};
          font-weight: 600;
          text-decoration: none;
        }

        .si-error {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.9rem;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .si-success {
          background: #dcfce7;
          color: #166534;
          padding: 0.9rem;
          border-radius: 12px;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="si-root">
        <div className="si-card">

          <h1 className="si-title">Sign in</h1>

          {error && <div className="si-error">{error}</div>}
          {success && <div className="si-success">{success}</div>}

          <form className="si-form" onSubmit={handleSubmit}>
            <div>
              <label className="si-label">Username or Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="si-input"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="si-label">Password</label>

              <div className="si-pw-wrap">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="si-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="si-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              <button type="button" className="si-forgot">
                Forgot password?
              </button>
            </div>

            <button
              className="si-submit"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="si-divider">
            <div className="si-divider-line" />
            <span className="si-divider-text">or</span>
            <div className="si-divider-line" />
          </div>

          <div className="si-social-list">
            {socialProviders.map(({ id, label, Icon }) => (
              <button
                key={id}
                className="si-social-btn"
                onClick={() => handleSocialSignIn(id)}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>

          <p className="si-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>

        </div>
      </div>
    </>
  )
}
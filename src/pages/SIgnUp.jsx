import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const countries = [
  'United States', 'United Kingdom', 'Nigeria', 'Canada', 'Australia',
  'Germany', 'France', 'India', 'Brazil', 'South Africa', 'UAE', 'Singapore', 'Other'
]

export default function SignUp() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirm: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setError('')
    setSuccess('')

    const { fullName, email, phone, country, password, confirm } = form

    if (!fullName || !email || !phone || !country || !password || !confirm) {
      setError('Please fill in all fields.')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setLoading(true)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            country
          }
        }
      })

      if (signUpError) throw signUpError

      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            balance: 10000
          })

        if (profileError) throw profileError
      }

      setSuccess('Account created successfully. Redirecting...')
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      setError(err.message || 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  const TEXT = '#0f172a'
  const MUTED = '#64748b'
  const BORDER = '#d6dbe7'
  const PRIMARY = '#1E4A7C'

  return (
    <>
      <style>{`
        .su-root {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 4rem 1rem;
          background: #eef1f7;
          font-family: 'Geist Variable', ui-sans-serif, system-ui;
        }

        .su-card {
          width: 100%;
          max-width: 500px;
          padding: 2.5rem 2rem;
          background: #fff;
          border-radius: 22px;
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.08),
            0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .su-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 500;
          margin-bottom: 2.4rem;
          color: ${TEXT};
        }

        .su-form {
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }

        .su-label {
          font-size: 0.74rem;
          font-weight: 600;
          text-transform: uppercase;
          color: ${MUTED};
          margin-bottom: 0.4rem;
          display: block;
        }

        .su-input {
          width: 100%;
          padding: 0.9rem 0;
          border: none;
          border-bottom: 1.5px solid ${BORDER};
          font-size: 1rem;
          outline: none;
          background: transparent;
          color: ${TEXT};
        }

        .su-input:focus {
          border-bottom-color: ${PRIMARY};
        }

        .su-submit {
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

        .su-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .su-error {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.9rem;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .su-success {
          background: #dcfce7;
          color: #166534;
          padding: 0.9rem;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .su-footer {
          margin-top: 2rem;
          text-align: center;
          color: ${MUTED};
        }

        .su-footer a {
          color: ${PRIMARY};
          font-weight: 600;
          text-decoration: none;
        }
      `}</style>

      <div className="su-root">
        <div className="su-card">
          <h1 className="su-title">Create account</h1>

          {error && <div className="su-error">{error}</div>}
          {success && <div className="su-success">{success}</div>}

          <form className="su-form" onSubmit={handleSubmit}>
            <div>
              <label className="su-label">Full Name</label>
              <input className="su-input" name="fullName" value={form.fullName} onChange={handleChange} />
            </div>

            <div>
              <label className="su-label">Email</label>
              <input className="su-input" type="email" name="email" value={form.email} onChange={handleChange} />
            </div>

            
            <div>
              <label className="su-label">Phone</label>
              <input className="su-input" name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div>
              <label className="su-label">Country</label>
              <select className="su-input" name="country" value={form.country} onChange={handleChange}>
                <option value="">Select country...</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="su-label">Password</label>
              <input className="su-input" type="password" name="password" value={form.password} onChange={handleChange} />
            </div>

            <div>
              <label className="su-label">Confirm Password</label>
              <input className="su-input" type="password" name="confirm" value={form.confirm} onChange={handleChange} />
            </div>

            <button className="su-submit" disabled={loading} type="submit">
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="su-footer">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}
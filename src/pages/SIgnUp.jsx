import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const countries = [
  'United States', 'United Kingdom', 'Nigeria', 'Canada', 'Australia',
  'Germany', 'France', 'India', 'Brazil', 'South Africa', 'UAE', 'Singapore', 'Other'
]

export default function SignUp() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirm: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { fullName, email, phone, country, password, confirm } = form

    if (!fullName || !email || !phone || !country || !password || !confirm) {
      setError('Please fill in all fields.')
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

    setLoading(true)
    setError('')

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

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        balance: 10000
      })
    }

    setLoading(false)
    navigate('/dashboard')
  }

  // SAME STYLE AS SIGNIN
  const inputStyle = {
    width: '100%',
    padding: '0.85rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        background: 'var(--color-bg)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>

        {/* TITLE */}
        <h1
          style={{
            textAlign: 'center',
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '2rem'
          }}
        >
          Create account
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
              marginBottom: '1rem'
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

          {/* FULL NAME */}
          <div>
            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>
              Full Name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              style={inputStyle}
              placeholder="John Doe"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          {/* PHONE */}
          <div>
            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>
              Country
            </label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select country...</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* PASSWORD */}
          <div>
            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label style={{ fontSize: '0.8rem', marginBottom: '0.3rem', display: 'block' }}>
              Confirm Password
            </label>
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '1rem',
              padding: '0.85rem',
              borderRadius: '999px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-primary)',
              color: 'black',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        {/* FOOTER */}
        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '2rem' }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ fontWeight: '600' }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
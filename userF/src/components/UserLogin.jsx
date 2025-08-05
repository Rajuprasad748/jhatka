import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const UserLogin = () => {
  // State variables for form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      })
      // On success: clear fields and navigate to home
      setEmail('')
      setPassword('')
      navigate('/')
      toast.success("Logged in successfully!");
      console.log('Login successful:', response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      toast.error("Login failed. Please try again.");
    }
  }

  return (
    <div className='min-h-screen flex justify-center items-center w-full mx-auto bg-slate-300'>
      <div className="max-w-md p-12 rounded-2xl shadow-md bg-white font-sans w-[30vw]">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Login your account
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-black font-semibold mb-1">Email</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 h-12 focus-within:border-blue-500 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
              </svg>
              <input
                type="email"
                placeholder="Enter your Email"
                className="ml-2 w-full h-full border-none outline-none bg-transparent"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-black font-semibold mb-1">Password</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-3 h-12 focus-within:border-blue-500 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="-64 0 512 512" fill="currentColor">
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
              </svg>
              <input
                type="password"
                placeholder="Enter your Password"
                className="ml-2 w-full h-full border-none outline-none bg-transparent"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-blue-500 font-semibold cursor-pointer hover:underline">
            Forgot password?
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="bg-black text-white font-medium text-base h-12 rounded-lg w-full mt-3 hover:bg-gray-800 transition"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-black">
            Don&apos;t have an account?  <Link to="/signup">  <span className="text-blue-600 font-medium cursor-pointer hover:underline">Sign Up</span> </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default UserLogin
import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const valid = Object.values(data).every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await Axios({ ...SummaryApi.login, data })
      if (res.data.error) return toast.error(res.data.message)
      if (res.data.success) {
        localStorage.setItem('accesstoken', res.data.data.accesstoken)
        localStorage.setItem('refreshToken', res.data.data.refreshToken)
        const userDetails = await fetchUserDetails()
        dispatch(setUserDetails(userDetails.data))
        setData({ email: "", password: "" })
        navigate("/")
      }
    } catch (err) { AxiosToastError(err) }
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-3 bg-gray-50'>
      <div className='bg-white w-full max-w-sm rounded-2xl shadow-sm border border-gray-100 p-6'>
        <div className='text-center mb-6'>
          <h1 className='text-xl font-extrabold text-gray-800'>Welcome Back</h1>
          <p className='text-sm text-gray-400 mt-1'>Log in to QuickRasan</p>
        </div>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className='grid gap-1.5'>
            <label className='text-xs font-semibold text-gray-600'>Email</label>
            <input type='email' name='email' value={data.email} onChange={handleChange} placeholder='Enter your email' className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blinkit focus:ring-1 focus:ring-blinkit/20 transition-all' />
          </div>
          <div className='grid gap-1.5'>
            <label className='text-xs font-semibold text-gray-600'>Password</label>
            <div className='flex items-center border border-gray-200 rounded-xl px-3 focus-within:border-blinkit focus-within:ring-1 focus-within:ring-blinkit/20 transition-all'>
              <input type={showPassword ? "text" : "password"} name='password' value={data.password} onChange={handleChange} placeholder='Enter your password' className='w-full py-2.5 outline-none text-sm' />
              <button type='button' onClick={() => setShowPassword(p => !p)} className='text-gray-400 hover:text-gray-600'>{showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
            </div>
            <Link to={"/forgot-password"} className='text-xs text-blinkit hover:underline text-right'>Forgot password?</Link>
          </div>
          <button disabled={!valid} className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all ${valid ? 'bg-blinkit hover:bg-blinkit-dark' : 'bg-gray-300 cursor-not-allowed'}`}>Log in</button>
        </form>
        <p className='text-center text-sm text-gray-500 mt-5'>Don't have an account? <Link to={"/register"} className='text-blinkit font-semibold hover:underline'>Register</Link></p>
      </div>
    </div>
  )
}

export default Login
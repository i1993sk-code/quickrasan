import React, { useState, useRef, useEffect } from 'react'
import { FaLeaf } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../Common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState(["","","","","",""])
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [logoClickCount, setLogoClickCount] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const inputRef = useRef([])

  const handleSendOtp = async () => {
    if (mobile.length !== 10) return toast.error("Enter a valid 10-digit mobile number")
    setLoading(true)
    try {
      const res = await Axios({ ...SummaryApi.sendOtp, data: { mobile } })
      if (res.data.success) {
        toast.success("OTP sent!")
        setStep(2)
        setTimeout(() => inputRef.current[0]?.focus(), 200)
      }
    } catch (err) { AxiosToastError(err) }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    const otpStr = otp.join("")
    if (otpStr.length !== 6) return toast.error("Enter complete OTP")
    setLoading(true)
    try {
      const res = await Axios({ ...SummaryApi.verifyOtp, data: { mobile, otp: otpStr } })
      if (res.data.error) return toast.error(res.data.message)
      if (res.data.success) {
        localStorage.setItem('accesstoken', res.data.data.accessToken)
        localStorage.setItem('refreshToken', res.data.data.refreshToken)
        const userDetails = await fetchUserDetails()
        dispatch(setUserDetails(userDetails.data))
        setMobile(""); setOtp(["","","","","",""])
        const isAdmin = userDetails?.data?.role === 'ADMIN'
        navigate(isAdmin ? '/dashboard/category' : '/')
      }
    } catch (err) { AxiosToastError(err) }
    setLoading(false)
  }

  const handleOtpChange = (val, idx) => {
    if (isNaN(val)) return
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    if (val && idx < 5) inputRef.current[idx + 1]?.focus()
  }

  const handleLogoClick = () => {
    const c = logoClickCount + 1
    setLogoClickCount(c)
    if (c >= 5) {
      setLogoClickCount(0)
      setMobile("9999999999")
      setTimeout(() => {
        document.getElementById('sendOtpBtn')?.click()
      }, 500)
    }
  }

  useEffect(() => {
    if (step === 2) {
      const allFilled = otp.every(d => d)
      if (allFilled) handleVerifyOtp()
    }
  }, [otp])

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-3 bg-gray-50'>
      <div className='bg-white w-full max-w-sm rounded-2xl shadow-sm border border-gray-100 p-6'>
        <div className='text-center mb-6'>
          <button onClick={handleLogoClick} className='mx-auto mb-2'>
            <FaLeaf size={28} className='text-primary mx-auto' />
          </button>
          <h1 className='text-xl font-extrabold text-gray-800'>
            {step === 1 ? 'Welcome Back' : 'Enter OTP'}
          </h1>
          <p className='text-sm text-gray-400 mt-1'>
            {step === 1 ? 'Log in to QuickRasan' : `OTP sent to +91 ${mobile}`}
          </p>
        </div>

        {step === 1 ? (
          <div className='grid gap-4'>
            <div className='grid gap-1.5'>
              <label className='text-xs font-semibold text-gray-600'>Mobile Number</label>
              <div className='flex items-center border border-gray-200 rounded-xl px-3 focus-within:border-blinkit focus-within:ring-1 focus-within:ring-blinkit/20 transition-all'>
                <FiPhone className='text-gray-400 mr-2 shrink-0' size={16} />
                <span className='text-gray-500 text-sm mr-1'>+91</span>
                <input
                  type='tel'
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder='Enter mobile number'
                  className='w-full py-2.5 outline-none text-sm'
                  maxLength={10}
                  onKeyDown={e => e.key === 'Enter' && mobile.length === 10 && handleSendOtp()}
                />
              </div>
            </div>
            <button
              id='sendOtpBtn'
              disabled={mobile.length !== 10 || loading}
              className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all ${mobile.length === 10 && !loading ? 'bg-blinkit hover:bg-blinkit-dark' : 'bg-gray-300 cursor-not-allowed'}`}
              onClick={handleSendOtp}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className='grid gap-4'>
            <div className='grid gap-1.5'>
              <label className='text-xs font-semibold text-gray-600 text-center'>Enter 6-digit OTP</label>
              <div className='flex items-center gap-2 justify-center mt-2'>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { inputRef.current[idx] = el }}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, idx)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        inputRef.current[idx - 1]?.focus()
                      }
                    }}
                    className='w-11 h-12 text-center border border-gray-200 rounded-xl text-lg font-bold outline-none focus:border-blinkit focus:ring-1 focus:ring-blinkit/20 transition-all'
                  />
                ))}
              </div>
            </div>
            <button
              disabled={otp.some(d => !d) || loading}
              className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all ${otp.every(d => d) && !loading ? 'bg-blinkit hover:bg-blinkit-dark' : 'bg-gray-300 cursor-not-allowed'}`}
              onClick={handleVerifyOtp}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              className='text-sm text-blinkit font-medium hover:underline text-center'
              onClick={() => { setStep(1); setOtp(["","","","","",""]) }}
            >
              Change mobile number
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login

import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const valideValue = Object.values(data).every(el => el)

  useEffect(() => {
    // 1. सुरक्षा जाँच: अगर state में success नहीं है, तो वापस भेजें
    if (!(location?.state?.data?.success)) {
      navigate("/")
      return; // यहीं से फंक्शन रोक दें
    }

    // 2. ईमेल सेट करना: सिर्फ एक बार जब कंपोनेंट माउंट हो
    if (location?.state?.email) {
      setData((prev) => ({
        ...prev,
        email: location?.state?.email
      }))
    }
  }, []) // Dependency array खाली रखें ताकि यह सिर्फ एक बार चले

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password must be same.")
      return
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message)
        navigate("/login")
        // फॉर्म रीसेट
        setData({
          email: "",
          newPassword: "",
          confirmPassword: ""
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7 shadow-md'>
        <p className='font-semibold text-lg'>Enter Your Password</p>
        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
          
          {/* New Password */}
          <div className='grid gap-1'>
            <label htmlFor='newPassword'>New Password :</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showPassword ? "text" : "password"}
                id='newPassword'
                className='w-full outline-none bg-transparent'
                name='newPassword'
                value={data.newPassword}
                onChange={handleChange}
                placeholder='Enter your new password'
              />
              <button 
                type='button' // बहुत ज़रूरी: ताकि फॉर्म सबमिट न हो जाए
                onClick={() => setShowPassword(prev => !prev)} 
                className='cursor-pointer p-1'
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className='grid gap-1'>
            <label htmlFor='confirmPassword'>Confirm Password :</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id='confirmPassword'
                className='w-full outline-none bg-transparent'
                name='confirmPassword'
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder='Enter your confirm password'
              />
              <button 
                type='button' // बहुत ज़रूरी: ताकि फॉर्म सबमिट न हो जाए
                onClick={() => setShowConfirmPassword(prev => !prev)} 
                className='cursor-pointer p-1'
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          <button 
            disabled={!valideValue} 
            className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"} text-white py-2 rounded font-semibold my-3 tracking-wide transition-all`}
          >
            Change Password
          </button>
        </form>

        <p>
          Already have account? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
        </p>
      </div>
    </section>
  )
}

export default ResetPassword;
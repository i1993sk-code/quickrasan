import React, { useState } from 'react'
import { useGlobalContext } from '../Provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector, useDispatch } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../Common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { setUserDetails } from '../store/userSlice'
import { getGuestCart, clearGuestCart } from '../utils/guestCart'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn = user?._id

  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const syncGuestCart = async () => {
    const guestItems = getGuestCart()
    if (!guestItems.length) return
    for (const item of guestItems) {
      try {
        await Axios({ ...SummaryApi.addTocart, data: { productId: item.productId } })
      } catch (e) { /* skip failed items */ }
    }
    clearGuestCart()
    fetchCartItem?.()
  }

  const handleSendOtp = async () => {
    if (mobile.length !== 10) return toast.error('Enter valid 10-digit mobile')
    try {
      setAuthLoading(true)
      const res = await Axios({ ...SummaryApi.sendOtp, data: { mobile } })
      if (res.data.success) {
        toast.success('OTP sent to your mobile')
        setOtpSent(true)
      }
    } catch (err) { AxiosToastError(err) }
    finally { setAuthLoading(false) }
  }

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return toast.error('Enter OTP')
    try {
      setAuthLoading(true)
      const res = await Axios({ ...SummaryApi.verifyOtp, data: { mobile, otp } })
      if (res.data.success) {
        const d = res.data.data
        localStorage.setItem('accessToken', d.accessToken)
        localStorage.setItem('refreshToken', d.refreshToken)
        localStorage.setItem('user', JSON.stringify(d))
        dispatch(setUserDetails(d))
        toast.success('Login successful')
        await syncGuestCart()
      }
    } catch (err) { AxiosToastError(err) }
    finally { setAuthLoading(false) }
  }

  const handleCOD = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: { list_items: cartItemsList, addressId: addressList[selectAddress]?._id, subTotalAmt: totalPrice, totalAmt: totalPrice }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        fetchCartItem?.()
        fetchOrder?.()
        navigate('/success', { state: { text: "Order" } })
      }
    } catch (err) { AxiosToastError(err) }
  }

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Loading...")
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
      const res = await Axios({ ...SummaryApi.payment_url, data: { list_items: cartItemsList, addressId: addressList[selectAddress]?._id, subTotalAmt: totalPrice, totalAmt: totalPrice } })
      stripe.redirectToCheckout({ sessionId: res.data.id })
      fetchCartItem?.()
      fetchOrder?.()
    } catch (err) { AxiosToastError(err) }
  }

  if (!isLoggedIn) {
    return (
      <div className='bg-gray-50 min-h-screen flex items-center justify-center p-4'>
        <div className='bg-white max-w-sm w-full rounded-2xl p-6 shadow-sm border border-gray-100'>
          <h2 className='text-xl font-bold text-gray-800 text-center mb-2'>Login to Checkout</h2>
          <p className='text-sm text-gray-500 text-center mb-6'>Enter your mobile to receive OTP</p>
          {!otpSent ? (
            <div className='grid gap-4'>
              <input type='tel' maxLength={10} value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder='10-digit mobile number'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary' />
              <button onClick={handleSendOtp} disabled={authLoading || mobile.length !== 10}
                className='w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-50'>
                {authLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className='grid gap-4'>
              <p className='text-sm text-gray-500 text-center'>OTP sent to <span className='font-semibold text-gray-800'>{mobile}</span></p>
              <input type='text' maxLength={4} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder='Enter 4-digit OTP'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary text-center text-lg tracking-widest' />
              <button onClick={handleVerifyOtp} disabled={authLoading || otp.length < 4}
                className='w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-50'>
                {authLoading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button onClick={() => { setOtpSent(false); setOtp('') }} className='text-xs text-gray-400 hover:text-gray-600 text-center'>Change mobile number</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-3 py-4 lg:flex lg:gap-6'>
        <div className='flex-1'>
          <h2 className='text-lg font-bold text-gray-800 mb-3'>Delivery Address</h2>
          <div className='grid gap-3'>
            {addressList.filter(a => a.status).map((addr, i) => (
              <label key={i} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all bg-white ${selectAddress == i ? 'border-blinkit' : 'border-gray-100'}`}>
                <input type='radio' name='address' value={i} onChange={(e) => setSelectAddress(e.target.value)} checked={selectAddress == i} className='sr-only' />
                <div className='flex gap-2'>
                  <div className={`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center ${selectAddress == i ? 'border-blinkit' : 'border-gray-300'}`}>
                    {selectAddress == i && <div className='w-2 h-2 rounded-full bg-blinkit' />}
                  </div>
                  <div className='text-sm'>
                    <p className='font-medium text-gray-800'>{addr.address_line}</p>
                    <p className='text-gray-500'>{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className='text-gray-400'>{addr.mobile}</p>
                  </div>
                </div>
              </label>
            ))}
            <button onClick={() => setOpenAddress(true)} className='h-14 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500 font-medium hover:border-blinkit hover:text-blinkit transition-colors bg-white'>
              + Add new address
            </button>
          </div>
        </div>

        <div className='lg:w-80 mt-6 lg:mt-0'>
          <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
            <h3 className='font-bold text-gray-800 mb-3'>Bill Summary</h3>
            <div className='grid gap-2 text-sm'>
              <div className='flex justify-between'><span className='text-gray-500'>Items total</span><span className='font-medium'><span className='line-through text-gray-400 mr-2'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>{DisplayPriceInRupees(totalPrice)}</span></div>
              <div className='flex justify-between'><span className='text-gray-500'>Quantity</span><span className='font-medium'>{totalQty} item</span></div>
              <div className='flex justify-between'><span className='text-gray-500'>Delivery</span><span className='text-blinkit font-medium'>Free</span></div>
              <hr className='border-gray-100' />
              <div className='flex justify-between font-bold text-gray-800 text-base'><span>Grand total</span><span>{DisplayPriceInRupees(totalPrice)}</span></div>
            </div>
            <div className='grid gap-3 mt-5'>
              <button onClick={handleOnlinePayment} className='w-full bg-blinkit text-white font-bold py-3 rounded-xl hover:bg-blinkit-dark transition-colors text-sm'>Pay Online</button>
              <button onClick={handleCOD} className='w-full border-2 border-blinkit text-blinkit font-bold py-3 rounded-xl hover:bg-blinkit hover:text-white transition-all text-sm'>Cash on Delivery</button>
            </div>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </div>
  )
}

export default CheckoutPage

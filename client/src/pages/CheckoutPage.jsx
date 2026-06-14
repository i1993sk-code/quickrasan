import React, { useState } from 'react'
import { useGlobalContext } from '../Provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../Common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

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
import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../Provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const goCheckout = () => {
    if (user?._id) {
      navigate("/checkout")
      if (close) close()
      return
    }
    toast("Please Login")
  }

  return (
    <div className='bg-black/60 fixed inset-0 z-50'>
      <div className='bg-white w-full max-w-sm min-h-screen ml-auto flex flex-col'>
        <div className='flex items-center justify-between p-4 border-b border-gray-100'>
          <h2 className='font-bold text-lg text-gray-800'>My Cart ({totalQty})</h2>
          <button onClick={close} className='p-1 hover:bg-gray-100 rounded-full transition-colors'><IoClose size={24} /></button>
        </div>

        <div className='flex-1 overflow-auto bg-gray-50 p-3'>
          {cartItem[0] ? (
            <div className='grid gap-3'>
              <div className='bg-blinkit-light rounded-xl px-4 py-2.5 flex items-center justify-between text-sm'>
                <span className='text-blinkit font-medium'>Total savings</span>
                <span className='text-blinkit font-bold'>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</span>
              </div>
              <div className='bg-white rounded-xl p-3 grid gap-3 shadow-sm border border-gray-100'>
                {cartItem.map(item => (
                  <div key={item._id} className='flex items-center gap-3'>
                    <div className='w-16 h-16 shrink-0 bg-white rounded-lg border border-gray-100 p-1'>
                      <img src={item?.productId?.image[0]} className='w-full h-full object-contain' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-800 line-clamp-2'>{item?.productId?.name}</p>
                      <p className='text-xs text-gray-400'>{item?.productId?.unit}</p>
                      <p className='text-sm font-bold text-gray-800 mt-0.5'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                    </div>
                    <AddToCartButton data={item?.productId} />
                  </div>
                ))}
              </div>
              <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 grid gap-2 text-sm'>
                <h3 className='font-bold text-gray-800 mb-1'>Bill Details</h3>
                <div className='flex justify-between'><span className='text-gray-500'>Items total</span><span><span className='line-through text-gray-400 mr-2'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span className='font-medium'>{DisplayPriceInRupees(totalPrice)}</span></span></div>
                <div className='flex justify-between'><span className='text-gray-500'>Quantity</span><span className='font-medium'>{totalQty} item</span></div>
                <div className='flex justify-between'><span className='text-gray-500'>Delivery</span><span className='text-blinkit font-medium'>Free</span></div>
                <hr className='border-gray-100' />
                <div className='flex justify-between font-bold text-gray-800'><span>Grand total</span><span>{DisplayPriceInRupees(totalPrice)}</span></div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full py-16'>
              <img src={imageEmpty} className='w-36 h-36 object-contain opacity-60' />
              <p className='text-gray-500 font-medium mt-3 mb-4'>Your cart is empty</p>
              <Link to="/" onClick={close} className='bg-blinkit text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blinkit-dark transition-colors'>Shop Now</Link>
            </div>
          )}
        </div>

        {cartItem[0] && (
          <div className='p-3 border-t border-gray-100 bg-white'>
            <button onClick={goCheckout} className='w-full bg-blinkit text-white font-bold text-base py-3 rounded-xl flex items-center justify-between px-5 hover:bg-blinkit-dark transition-colors shadow-lg shadow-blinkit/20'>
              <span>{DisplayPriceInRupees(totalPrice)}</span>
              <span className='flex items-center gap-1'>Proceed <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayCartItem
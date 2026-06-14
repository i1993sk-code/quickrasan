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
import { FaBolt, FaLeaf } from "react-icons/fa6";

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
    <div className='bg-black/60 fixed inset-0 z-50 animate-fade-in'>
      <div className='bg-white w-full max-w-sm min-h-screen ml-auto flex flex-col shadow-2xl'>
        <div className='flex items-center justify-between p-4 bg-primary'>
          <h2 className='font-bold text-lg text-white flex items-center gap-2'>
            <FaLeaf size={16} />
            My Cart ({totalQty})
          </h2>
          <button onClick={close} className='p-1 hover:bg-white/10 rounded-full transition-colors text-white'><IoClose size={24} /></button>
        </div>

        <div className='flex-1 overflow-auto' style={{background: 'linear-gradient(180deg, #f6fff2 0%, #ffffff 100%)'}}>
          {cartItem[0] ? (
            <div className='grid gap-3 p-3'>
              <div className='bg-primary-light rounded-xl px-4 py-2.5 flex items-center justify-between text-sm border border-primary/10'>
                <span className='text-primary font-semibold flex items-center gap-1.5'>
                  <FaBolt size={14} /> Total savings
                </span>
                <span className='text-accent font-bold'>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</span>
              </div>
              <div className='bg-white rounded-xl p-3 grid gap-3 shadow-sm border border-gray-100'>
                {cartItem.map(item => (
                  <div key={item._id} className='flex items-center gap-3'>
                    <div className='w-16 h-16 shrink-0 bg-primary-light/50 rounded-xl border border-primary/10 p-1'>
                      <img src={item?.productId?.image[0]} className='w-full h-full object-contain' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-gray-800 line-clamp-2'>{item?.productId?.name}</p>
                      <p className='text-xs text-gray-400'>{item?.productId?.unit}</p>
                      <p className='text-sm font-bold text-gray-900 mt-0.5'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                    </div>
                    <AddToCartButton data={item?.productId} />
                  </div>
                ))}
              </div>
              <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 grid gap-2 text-sm'>
                <h3 className='font-bold text-primary mb-1'>Bill Details</h3>
                <div className='flex justify-between'><span className='text-gray-500'>Items total</span><span><span className='line-through text-gray-400 mr-2'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span className='font-semibold'>{DisplayPriceInRupees(totalPrice)}</span></span></div>
                <div className='flex justify-between'><span className='text-gray-500'>Quantity</span><span className='font-semibold'>{totalQty} item</span></div>
                <div className='flex justify-between'><span className='text-gray-500'>Delivery</span><span className='text-accent font-semibold'>Free</span></div>
                <hr className='border-gray-100' />
                <div className='flex justify-between font-bold text-gray-800'><span>Grand total</span><span className='text-primary'>{DisplayPriceInRupees(totalPrice)}</span></div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full py-16'>
              <img src={imageEmpty} className='w-36 h-36 object-contain opacity-60' />
              <p className='text-gray-500 font-medium mt-3 mb-4'>Your cart is empty</p>
              <Link to="/" onClick={close} className='bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20'>Shop Now</Link>
            </div>
          )}
        </div>

        {cartItem[0] && (
          <div className='p-3 border-t border-gray-100 bg-white'>
            <button onClick={goCheckout} className='w-full bg-primary text-white font-bold text-base py-3 rounded-xl flex items-center justify-between px-5 hover:bg-primary-dark transition-all shadow-lg shadow-primary/30'>
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

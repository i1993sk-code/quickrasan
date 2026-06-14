import React from 'react'
import { useGlobalContext } from '../Provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaLeaf } from "react-icons/fa6";

const CartMobileLink = () => {
  const { totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)

  if (!cartItem[0]) return null

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden animate-slide-up'>
      <Link to={"/cart"} className='flex items-center justify-between bg-primary text-white px-4 py-3 rounded-xl shadow-lg shadow-primary/30'>
        <div className='flex items-center gap-3'>
          <div className='bg-white/15 rounded-lg p-2'>
            <FaLeaf size={18} />
          </div>
          <div>
            <p className='text-sm font-bold'>{totalQty} Items</p>
            <p className='text-lg font-extrabold'>{DisplayPriceInRupees(totalPrice)}</p>
          </div>
        </div>
        <div className='flex items-center gap-1 text-sm font-bold'>
          <span>View Cart</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </Link>
    </div>
  )
}

export default CartMobileLink

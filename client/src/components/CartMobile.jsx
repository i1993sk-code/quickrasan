import React from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CartMobileLink = () => {
  const { totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)

  if (!cartItem[0]) return null

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden'>
      <Link to={"/cart"} className='flex items-center justify-between bg-blinkit text-white px-4 py-3 rounded-xl shadow-lg shadow-blinkit/30'>
        <div className='flex items-center gap-3'>
          <div className='bg-white/20 rounded-lg p-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
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
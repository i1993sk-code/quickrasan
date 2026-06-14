import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../Provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'
import { FaBolt, FaLeaf } from "react-icons/fa6"
import { getGuestCart, removeFromGuestCart, updateGuestCartQty } from '../utils/guestCart'
import Axios from '../utils/Axios'
import SummaryApi from '../Common/SummaryApi'

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [guestProducts, setGuestProducts] = useState([])
  const [loadingGuest, setLoadingGuest] = useState(false)
  const isLoggedIn = user?._id

  useEffect(() => {
    if (isLoggedIn) return
    const guestItems = getGuestCart()
    if (!guestItems.length) { setGuestProducts([]); return }
    setLoadingGuest(true)
    Promise.all(guestItems.map(async (g) => {
      try {
        const res = await Axios({ ...SummaryApi.getProductDetails, data: { productId: g.productId } })
        if (res.data.success) return { ...res.data.data, guestQty: g.quantity }
      } catch { return null }
      return null
    })).then(results => {
      setGuestProducts(results.filter(Boolean))
      setLoadingGuest(false)
    })
  }, [isLoggedIn, cartItem])

  const items = isLoggedIn ? cartItem : guestProducts
  const guestTotal = guestProducts.reduce((s, p) => s + pricewithDiscount(p.price, p.discount) * p.guestQty, 0)
  const guestOrigTotal = guestProducts.reduce((s, p) => s + p.price * p.guestQty, 0)

  const goCheckout = () => {
    navigate("/checkout")
    if (close) close()
  }

  const removeGuestItem = (productId) => {
    removeFromGuestCart(productId)
    setGuestProducts(prev => prev.filter(p => p._id !== productId))
    toast.success('Removed from cart')
  }

  return (
    <div className='bg-black/60 fixed inset-0 z-50 animate-fade-in'>
      <div className='bg-white w-full max-w-sm min-h-screen ml-auto flex flex-col shadow-2xl'>
        <div className='flex items-center justify-between p-4 bg-primary'>
          <h2 className='font-bold text-lg text-white flex items-center gap-2'>
            <FaLeaf size={16} />
            My Cart ({isLoggedIn ? totalQty : guestProducts.reduce((s, i) => s + i.guestQty, 0)})
          </h2>
          <button onClick={close} className='p-1 hover:bg-white/10 rounded-full transition-colors text-white'><IoClose size={24} /></button>
        </div>

        <div className='flex-1 overflow-auto' style={{background: 'linear-gradient(180deg, #f6fff2 0%, #ffffff 100%)'}}>
          {items.length > 0 ? (
            <div className='grid gap-3 p-3'>
              <div className='bg-primary-light rounded-xl px-4 py-2.5 flex items-center justify-between text-sm border border-primary/10'>
                <span className='text-primary font-semibold flex items-center gap-1.5'>
                  <FaBolt size={14} /> Total savings
                </span>
                <span className='text-accent font-bold'>{DisplayPriceInRupees((isLoggedIn ? notDiscountTotalPrice - totalPrice : guestOrigTotal - guestTotal) || 0)}</span>
              </div>
              <div className='bg-white rounded-xl p-3 grid gap-3 shadow-sm border border-gray-100'>
                {isLoggedIn ? cartItem.map(item => (
                  <div key={item._id} className='flex items-center gap-3'>
                    <div className='w-16 h-16 shrink-0 bg-primary-light/50 rounded-xl border border-primary/10 p-1'>
                      <img src={item?.productId?.image[0]} className='w-full h-full object-contain' onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231B5E20' width='100' height='100'/%3E%3Ctext x='50' y='58' font-family='Arial' font-size='36' font-weight='bold' fill='%23FF8F00' text-anchor='middle'%3EQR%3C/text%3E%3C/svg%3E"; }} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-gray-800 line-clamp-2'>{item?.productId?.name}</p>
                      <p className='text-xs text-gray-400'>{item?.productId?.unit}</p>
                      <p className='text-sm font-bold text-gray-900 mt-0.5'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                    </div>
                    <AddToCartButton data={item?.productId} />
                  </div>
                )) : guestProducts.map(p => (
                  <div key={p._id} className='flex items-center gap-3'>
                    <div className='w-16 h-16 shrink-0 bg-primary-light/50 rounded-xl border border-primary/10 p-1'>
                      <img src={p.image[0]} className='w-full h-full object-contain' onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231B5E20' width='100' height='100'/%3E%3Ctext x='50' y='58' font-family='Arial' font-size='36' font-weight='bold' fill='%23FF8F00' text-anchor='middle'%3EQR%3C/text%3E%3C/svg%3E"; }} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-gray-800 line-clamp-2'>{p.name}</p>
                      <p className='text-xs text-gray-400'>{p.unit}</p>
                      <p className='text-sm font-bold text-gray-900 mt-0.5'>{DisplayPriceInRupees(pricewithDiscount(p.price, p.discount))}</p>
                    </div>
                    <button onClick={() => removeGuestItem(p._id)} className='text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1'>Remove</button>
                  </div>
                ))}
              </div>
              <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 grid gap-2 text-sm'>
                <h3 className='font-bold text-primary mb-1'>Bill Details</h3>
                <div className='flex justify-between'><span className='text-gray-500'>Items total</span><span><span className='line-through text-gray-400 mr-2'>{DisplayPriceInRupees(isLoggedIn ? notDiscountTotalPrice : guestOrigTotal)}</span><span className='font-semibold'>{DisplayPriceInRupees(isLoggedIn ? totalPrice : guestTotal)}</span></span></div>
                <div className='flex justify-between'><span className='text-gray-500'>Quantity</span><span className='font-semibold'>{isLoggedIn ? totalQty : guestProducts.reduce((s, i) => s + i.guestQty, 0)} item</span></div>
                <div className='flex justify-between'><span className='text-gray-500'>Delivery</span><span className='text-accent font-semibold'>Free</span></div>
                <hr className='border-gray-100' />
                <div className='flex justify-between font-bold text-gray-800'><span>Grand total</span><span className='text-primary'>{DisplayPriceInRupees(isLoggedIn ? totalPrice : guestTotal)}</span></div>
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

        {items.length > 0 && (
          <div className='p-3 border-t border-gray-100 bg-white'>
            <button onClick={goCheckout} className='w-full bg-primary text-white font-bold text-base py-3 rounded-xl flex items-center justify-between px-5 hover:bg-primary-dark transition-all shadow-lg shadow-primary/30'>
              <span>{DisplayPriceInRupees(isLoggedIn ? totalPrice : guestTotal)}</span>
              <span className='flex items-center gap-1'>Proceed <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DisplayCartItem

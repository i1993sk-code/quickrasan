import React, { useEffect, useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { validURLConvert } from '../utils/validURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../Common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../Provider/GlobalProvider'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus, FaBolt } from "react-icons/fa6"
import { addToGuestCart, isInGuestCart, getGuestCartQty, updateGuestCartQty, removeFromGuestCart } from '../utils/guestCart'

const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const isLoggedIn = user?._id
  const [isInCart, setIsInCart] = useState(false)
  const [qty, setQty] = useState(0)
  const [cartId, setCartId] = useState(null)
  const discounted = pricewithDiscount(data.price, data.discount)

  useEffect(() => {
    if (!isLoggedIn) {
      setIsInCart(isInGuestCart(data._id))
      setQty(getGuestCartQty(data._id))
      return
    }
    const item = cartItem.find(item => item.productId._id === data._id)
    setIsInCart(!!item)
    setQty(item?.quantity || 0)
    setCartId(item?._id || null)
  }, [data._id, cartItem, isLoggedIn])

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      addToGuestCart(data._id)
      setIsInCart(true)
      setQty(1)
      toast.success("Added to cart")
      return
    }
    try {
      setLoading(true)
      const res = await Axios({ ...SummaryApi.addTocart, data: { productId: data._id } })
      if (res.data.success) {
        toast.success(res.data.message)
        fetchCartItem()
      }
    } catch (err) {
      AxiosToastError(err)
    } finally {
      setLoading(false)
    }
  }

  const incQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      const items = updateGuestCartQty(data._id, qty + 1)
      setQty(items.find(i => i.productId === data._id)?.quantity || 0)
      toast.success("Item added")
      return
    }
    const res = await updateCartItem(cartId, qty + 1)
    if (res?.success) toast.success("Item added")
  }

  const decQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      if (qty === 1) {
        removeFromGuestCart(data._id)
        setIsInCart(false)
        setQty(0)
      } else {
        const items = updateGuestCartQty(data._id, qty - 1)
        setQty(items.find(i => i.productId === data._id)?.quantity || 0)
      }
      return
    }
    if (qty === 1) {
      deleteCartItem(cartId)
    } else {
      const res = await updateCartItem(cartId, qty - 1)
      if (res?.success) toast.success("Item removed")
    }
  }

  return (
    <Link to={url} className='min-w-[160px] max-w-[160px] md:min-w-[190px] md:max-w-[190px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden shrink-0 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group'>
      <div className='relative h-36 md:h-40 bg-gradient-to-b from-primary-light/50 to-white flex items-center justify-center p-3'>
        <img src={data.image[0]} alt={data.name} className='w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300' onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231B5E20' width='100' height='100'/%3E%3Ctext x='50' y='58' font-family='Arial' font-size='36' font-weight='bold' fill='%23FF8F00' text-anchor='middle'%3EQR%3C/text%3E%3C/svg%3E"; }} />
        {data.discount > 0 && (
          <span className='absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm'>
            {data.discount}% OFF
          </span>
        )}
        <span className='absolute top-2 right-2 bg-primary/10 text-primary text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5'>
          <FaBolt size={8} /> 10 min
        </span>
      </div>
      <div className='px-2.5 pb-3 -mt-1 relative z-10'>
        <p className='text-[13px] font-bold text-gray-800 leading-tight line-clamp-2 min-h-[32px]'>{data.name}</p>
        <p className='text-[11px] text-gray-400 mt-0.5'>{data.unit}</p>
        <div className='flex items-center justify-between mt-2'>
          <div>
            <p className='text-base font-extrabold text-gray-900'>{DisplayPriceInRupees(discounted)}</p>
            {data.discount > 0 && (
              <p className='text-[11px] text-gray-400 line-through'>{DisplayPriceInRupees(data.price)}</p>
            )}
          </div>
          {data.stock === 0 ? (
            <span className='text-[11px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full'>Out</span>
          ) : isInCart ? (
            <div className='flex items-center gap-1 bg-primary text-white rounded-full shadow-sm'>
              <button onClick={decQty} className='w-7 h-7 flex items-center justify-center hover:bg-primary-dark rounded-full transition-colors'><FaMinus size={10} /></button>
              <span className='w-5 text-center text-sm font-bold'>{qty}</span>
              <button onClick={incQty} className='w-7 h-7 flex items-center justify-center hover:bg-primary-dark rounded-full transition-colors'><FaPlus size={10} /></button>
            </div>
          ) : (
            <button onClick={handleAdd} disabled={loading} className='text-primary border-2 border-primary/20 text-xs font-bold px-5 py-1.5 rounded-full bg-primary-light hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md'>
              {loading ? '...' : 'ADD'}
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CardProduct

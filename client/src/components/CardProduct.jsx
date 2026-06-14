import React, { useEffect, useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { validURLConvert } from '../utils/validURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../provider/GlobalProvider'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";

const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const [isInCart, setIsInCart] = useState(false)
  const [qty, setQty] = useState(0)
  const [cartId, setCartId] = useState(null)
  const discounted = pricewithDiscount(data.price, data.discount)

  useEffect(() => {
    const item = cartItem.find(item => item.productId._id === data._id)
    setIsInCart(!!item)
    setQty(item?.quantity || 0)
    setCartId(item?._id || null)
  }, [data._id, cartItem])

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
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
    const res = await updateCartItem(cartId, qty + 1)
    if (res?.success) toast.success("Item added")
  }

  const decQty = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (qty === 1) {
      deleteCartItem(cartId)
    } else {
      const res = await updateCartItem(cartId, qty - 1)
      if (res?.success) toast.success("Item removed")
    }
  }

  return (
    <Link to={url} className='min-w-[160px] max-w-[160px] md:min-w-[180px] md:max-w-[180px] bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden shrink-0 hover:shadow-md transition-shadow'>
      <div className='h-32 md:h-36 bg-white flex items-center justify-center p-3'>
        <img src={data.image[0]} alt={data.name} className='w-full h-full object-contain' />
      </div>
      <div className='px-2.5 pb-3'>
        {data.discount > 0 && (
          <span className='text-[11px] font-semibold text-blinkit bg-blinkit-light px-1.5 py-0.5 rounded inline-block mb-1'>
            {data.discount}% OFF
          </span>
        )}
        <p className='text-[13px] font-semibold text-gray-800 leading-tight line-clamp-2 min-h-[32px]'>{data.name}</p>
        <p className='text-[11px] text-gray-400 mt-0.5'>{data.unit}</p>
        <div className='flex items-center justify-between mt-2'>
          <div>
            <p className='text-sm font-bold text-gray-800'>{DisplayPriceInRupees(discounted)}</p>
            {data.discount > 0 && (
              <p className='text-[11px] text-gray-400 line-through'>{DisplayPriceInRupees(data.price)}</p>
            )}
          </div>
          {data.stock === 0 ? (
            <span className='text-[11px] text-red-500 font-medium'>Out</span>
          ) : isInCart ? (
            <div className='flex items-center gap-1 bg-blinkit text-white rounded-full'>
              <button onClick={decQty} className='w-7 h-7 flex items-center justify-center hover:bg-blinkit-dark rounded-full transition-colors'><FaMinus size={10} /></button>
              <span className='w-5 text-center text-sm font-semibold'>{qty}</span>
              <button onClick={incQty} className='w-7 h-7 flex items-center justify-center hover:bg-blinkit-dark rounded-full transition-colors'><FaPlus size={10} /></button>
            </div>
          ) : (
            <button onClick={handleAdd} disabled={loading} className='text-blinkit border border-blinkit text-xs font-bold px-4 py-1.5 rounded-full hover:bg-blinkit hover:text-white transition-all disabled:opacity-50'>
              {loading ? '...' : 'ADD'}
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CardProduct
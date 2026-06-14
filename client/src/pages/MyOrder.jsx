import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Axios from '../utils/Axios'
import SummaryApi from '../Common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const statusColors = {
  'Pending': 'bg-orange-100 text-orange-700',
  'Packed': 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-indigo-100 text-indigo-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
}

const MyOrder = () => {
  const orders = useSelector(state => state.orders.order) || []
  const [cancelModal, setCancelModal] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }
    setCancelling(true)
    try {
      const res = await Axios({
        ...SummaryApi.cancelOrder,
        data: { orderId: cancelModal._id, cancel_reason: cancelReason }
      })
      if (res.data.success) {
        toast.success('Order cancelled')
        setCancelModal(null)
        setCancelReason('')
        window.location.reload()
      }
    } catch (err) { AxiosToastError(err) }
    setCancelling(false)
  }

  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>My Orders</h1>
      </div>

      {orders.length === 0 && <NoData />}

      <div className='grid gap-3 p-3'>
        {orders.map((order) => (
          <div key={order._id} className='border rounded-lg p-3 bg-white shadow-sm'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs text-gray-500'>Order: {order.orderId?.slice(-10)}</p>
              <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[order.delivery_status] || 'bg-gray-100'}`}>
                {order.delivery_status}
              </span>
            </div>
            <div className='flex gap-3'>
              <img src={order.product_details?.image?.[0]} className='w-16 h-16 object-scale-down rounded border' alt={order.product_details?.name} />
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-sm truncate'>{order.product_details?.name}</p>
                <p className='text-xs text-gray-500'>Qty: {order.quantity}</p>
                <p className='text-sm font-semibold text-primary'>{DisplayPriceInRupees(order.totalAmt)}</p>
                {order.cancel_reason && <p className='text-xs text-red-500 mt-1'>Reason: {order.cancel_reason}</p>}
              </div>
            </div>
            {order.delivery_status === 'Pending' && (
              <button onClick={() => setCancelModal(order)} className='mt-2 text-xs text-red-600 border border-red-300 rounded px-3 py-1 hover:bg-red-50'>
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>

      {cancelModal && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4' onClick={() => setCancelModal(null)}>
          <div className='bg-white rounded-xl p-5 max-w-sm w-full' onClick={e => e.stopPropagation()}>
            <h3 className='font-bold text-lg mb-1'>Cancel Order</h3>
            <p className='text-sm text-gray-500 mb-3'>Why do you want to cancel?</p>
            <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} className='w-full border rounded-lg p-2 text-sm min-h-[80px]' placeholder='Enter reason...' />
            <div className='flex gap-2 mt-3'>
              <button onClick={() => setCancelModal(null)} className='flex-1 border rounded-lg py-2 text-sm'>Close</button>
              <button onClick={handleCancel} disabled={cancelling} className='flex-1 bg-red-600 text-white rounded-lg py-2 text-sm disabled:opacity-50'>
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrder

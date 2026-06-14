import React, { useEffect, useState, useCallback } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../Common/SummaryApi'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const tabs = [
  { key: 'pending', label: 'Pending', filter: s => s === 'Pending', color: 'bg-orange-500' },
  { key: 'packed', label: 'Packed', filter: s => s === 'Packed', color: 'bg-blue-500' },
  { key: 'outfordelivery', label: 'Out for Delivery', filter: s => s === 'Out for Delivery', color: 'bg-indigo-500' },
  { key: 'delivered', label: 'Delivered', filter: s => s === 'Delivered', color: 'bg-green-500' },
  { key: 'cancelled', label: 'Cancelled', filter: s => s === 'Cancelled', color: 'bg-red-500' },
]

const statusBadge = (s) => {
  const map = {
    'Pending': 'bg-orange-100 text-orange-700',
    'Packed': 'bg-blue-100 text-blue-700',
    'Out for Delivery': 'bg-indigo-100 text-indigo-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
  }
  return <span className={`text-xs px-2 py-0.5 rounded font-medium ${map[s] || 'bg-gray-100'}`}>{s}</span>
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedOrders, setSelectedOrders] = useState([])
  const [cancelModal, setCancelModal] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await Axios({ ...SummaryApi.getAllOrders })
      if (res.data.success) setOrders(res.data.data)
    } catch (err) { AxiosToastError(err) }
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const stats = {
    Pending: orders.filter(o => o.delivery_status === 'Pending').length,
    Packed: orders.filter(o => o.delivery_status === 'Packed').length,
    'Out for Delivery': orders.filter(o => o.delivery_status === 'Out for Delivery').length,
    Delivered: orders.filter(o => o.delivery_status === 'Delivered').length,
    Cancelled: orders.filter(o => o.delivery_status === 'Cancelled').length,
  }

  const activeTabDef = tabs.find(t => t.key === activeTab)
  const filteredOrders = orders.filter(o => activeTabDef.filter(o.delivery_status))

  const toggleSelect = (id) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleSelectAll = () => {
    const ids = filteredOrders.map(o => o._id)
    setSelectedOrders(prev => prev.length === ids.length ? [] : ids)
  }

  const handleBulkStatus = async (status) => {
    if (selectedOrders.length === 0) { toast.error('Select orders first'); return }
    if (status === 'Cancelled') {
      setCancelReason('')
      setCancelModal({ orderIds: selectedOrders, status: 'Cancelled' })
      return
    }
    setUpdating(true)
    try {
      const res = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderIds: selectedOrders, delivery_status: status }
      })
      if (res.data.success) { toast.success('Updated'); setSelectedOrders([]); fetchOrders() }
    } catch (err) { AxiosToastError(err) }
    setUpdating(false)
  }

  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) { toast.error('Enter cancellation reason'); return }
    setUpdating(true)
    try {
      const res = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderIds: cancelModal.orderIds, delivery_status: 'Cancelled', cancel_reason: cancelReason }
      })
      if (res.data.success) { toast.success('Orders cancelled'); setCancelModal(null); setSelectedOrders([]); fetchOrders() }
    } catch (err) { AxiosToastError(err) }
    setUpdating(false)
  }

  const handleSingleAction = async (orderId, status) => {
    if (status === 'Cancelled') {
      setCancelReason('')
      setCancelModal({ orderIds: [orderId], status: 'Cancelled' })
      return
    }
    setUpdating(true)
    try {
      const res = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderIds: [orderId], delivery_status: status }
      })
      if (res.data.success) { toast.success('Updated'); fetchOrders() }
    } catch (err) { AxiosToastError(err) }
    setUpdating(false)
  }

  return (
    <div className='p-3'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-xl font-bold'>Admin Dashboard</h1>
        <button onClick={fetchOrders} className='text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark'>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-5 gap-2 mb-4'>
        {Object.entries(stats).map(([label, count]) => (
          <div key={label} className='bg-white rounded-lg border p-3 text-center shadow-sm'>
            <p className='text-2xl font-bold text-primary'>{count}</p>
            <p className='text-xs text-gray-500'>{label}</p>
          </div>
        ))}
      </div>

      <div className='flex gap-1 overflow-x-auto mb-3'>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedOrders([]) }}
            className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap font-medium ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {tab.label} ({stats[tab.label] || 0})
          </button>
        ))}
      </div>

      {(activeTab === 'pending' || activeTab === 'packed' || activeTab === 'outfordelivery') && (
        <div className='flex gap-1 flex-wrap mb-3'>
          {activeTab === 'pending' && (
            <>
              <button onClick={() => handleBulkStatus('Packed')} disabled={updating} className='text-xs bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50'>Pack Selected</button>
              <button onClick={() => handleBulkStatus('Cancelled')} disabled={updating} className='text-xs bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50'>Cancel Selected</button>
            </>
          )}
          {activeTab === 'packed' && (
            <button onClick={() => handleBulkStatus('Out for Delivery')} disabled={updating} className='text-xs bg-indigo-600 text-white px-3 py-1 rounded disabled:opacity-50'>Dispatch Selected</button>
          )}
          {activeTab === 'outfordelivery' && (
            <button onClick={() => handleBulkStatus('Delivered')} disabled={updating} className='text-xs bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50'>Mark Delivered</button>
          )}
        </div>
      )}

      {loading ? (
        <p className='text-center text-gray-400 py-8'>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className='text-center text-gray-400 py-8'>No orders found</p>
      ) : (
        <div className='grid gap-3'>
          {filteredOrders.map(order => (
            <div key={order._id} className='bg-white border rounded-lg p-3 shadow-sm'>
              <div className='flex items-start gap-2'>
                {(activeTab === 'pending' || activeTab === 'packed' || activeTab === 'outfordelivery') && (
                  <input type='checkbox' checked={selectedOrders.includes(order._id)} onChange={() => toggleSelect(order._id)} className='mt-1' />
                )}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between gap-2 mb-1'>
                    <p className='text-xs text-gray-500'>{order.orderId?.slice(-10)} | {new Date(order.createdAt).toLocaleDateString()}</p>
                    {statusBadge(order.delivery_status)}
                  </div>
                  <div className='flex gap-2 items-center'>
                    <img src={order.product_details?.image?.[0]} className='w-10 h-10 object-scale-down rounded border' alt='' />
                    <div className='text-xs flex-1 min-w-0'>
                      <p className='font-medium truncate'>{order.product_details?.name}</p>
                      <p className='text-gray-500'>Qty: {order.quantity} | {DisplayPriceInRupees(order.totalAmt)}</p>
                    </div>
                  </div>
                  <div className='text-xs text-gray-600 mt-1 bg-gray-50 rounded p-2'>
                    <p className='font-medium'>{order.userId?.name || 'N/A'} | {order.userId?.mobile || 'N/A'}</p>
                    {order.delivery_address && (
                      <p>{order.delivery_address.address_line}, {order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</p>
                    )}
                    {order.cancel_reason && <p className='text-red-500 mt-1'>Cancel reason: {order.cancel_reason} {order.cancelled_by ? `(by ${order.cancelled_by})` : ''}</p>}
                  </div>
                  <div className='flex gap-1 mt-2'>
                    {order.delivery_status === 'Pending' && (
                      <>
                        <button onClick={() => handleSingleAction(order._id, 'Packed')} disabled={updating} className='text-xs bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50'>Pack</button>
                        <button onClick={() => handleSingleAction(order._id, 'Cancelled')} disabled={updating} className='text-xs bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50'>Cancel</button>
                      </>
                    )}
                    {order.delivery_status === 'Packed' && (
                      <button onClick={() => handleSingleAction(order._id, 'Out for Delivery')} disabled={updating} className='text-xs bg-indigo-600 text-white px-2 py-1 rounded disabled:opacity-50'>Dispatch</button>
                    )}
                    {order.delivery_status === 'Out for Delivery' && (
                      <button onClick={() => handleSingleAction(order._id, 'Delivered')} disabled={updating} className='text-xs bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50'>Mark Delivered</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelModal && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4' onClick={() => setCancelModal(null)}>
          <div className='bg-white rounded-xl p-5 max-w-sm w-full' onClick={e => e.stopPropagation()}>
            <h3 className='font-bold text-lg mb-1'>Cancel Order{cancelModal.orderIds.length > 1 ? 's' : ''}</h3>
            <p className='text-sm text-gray-500 mb-3'>Reason for cancellation ({cancelModal.orderIds.length} order{cancelModal.orderIds.length > 1 ? 's' : ''})</p>
            <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} className='w-full border rounded-lg p-2 text-sm min-h-[80px]' placeholder='Enter reason...' />
            <div className='flex gap-2 mt-3'>
              <button onClick={() => setCancelModal(null)} className='flex-1 border rounded-lg py-2 text-sm'>Close</button>
              <button onClick={handleCancelConfirm} disabled={updating} className='flex-1 bg-red-600 text-white rounded-lg py-2 text-sm disabled:opacity-50'>
                {updating ? 'Processing...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

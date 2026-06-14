import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../Common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const AdminPartners = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchPartners = async () => {
    setLoading(true)
    try {
      const res = await Axios({ ...SummaryApi.getPartners })
      if (res.data.success) setPartners(res.data.data)
    } catch (err) { AxiosToastError(err) }
    setLoading(false)
  }

  useEffect(() => { fetchPartners() }, [])

  const handleStatus = async (partnerId, status) => {
    try {
      const res = await Axios({ ...SummaryApi.updatePartnerStatus, data: { partnerId, status } })
      if (res.data.success) {
        toast.success(status === 'Approved' ? 'Partner approved! Email sent.' : 'Partner rejected')
        fetchPartners()
      }
    } catch (err) { AxiosToastError(err) }
  }

  const filtered = filter === 'all' ? partners : partners.filter(p => p.status === filter)

  const counts = { all: partners.length, Pending: partners.filter(p => p.status === 'Pending').length, Approved: partners.filter(p => p.status === 'Approved').length, Rejected: partners.filter(p => p.status === 'Rejected').length }

  const statusBadge = (s) => {
    const map = { Pending: 'bg-orange-100 text-orange-700', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700' }
    return <span className={`text-xs px-2 py-0.5 rounded font-medium ${map[s]}`}>{s}</span>
  }

  return (
    <div className='p-3'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-xl font-bold'>Partner Applications</h1>
        <button onClick={fetchPartners} className='text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark'>{loading ? '...' : 'Refresh'}</button>
      </div>

      <div className='grid grid-cols-4 gap-2 mb-4'>
        {Object.entries(counts).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`bg-white rounded-lg border p-3 text-center shadow-sm ${filter === k ? 'ring-2 ring-primary' : ''}`}>
            <p className='text-2xl font-bold text-primary'>{v}</p>
            <p className='text-xs text-gray-500 capitalize'>{k}</p>
          </button>
        ))}
      </div>

      {loading ? <p className='text-center text-gray-400 py-8'>Loading...</p> : filtered.length === 0 ? <p className='text-center text-gray-400 py-8'>No applications found</p> : (
        <div className='grid gap-3'>
          {filtered.map(p => (
            <div key={p._id} className='bg-white border rounded-lg p-4 shadow-sm'>
              <div className='flex items-start justify-between gap-2 mb-2'>
                <div>
                  <h3 className='font-bold text-gray-800'>{p.shopName}</h3>
                  <p className='text-xs text-gray-500'>{p.ownerName} | {p.mobile}</p>
                </div>
                {statusBadge(p.status)}
              </div>
              {p.email && <p className='text-xs text-gray-500 mb-1'>📧 {p.email}</p>}
              <p className='text-xs text-gray-500 mb-2'>📍 {p.address}, {p.city}, {p.district}, {p.state} - {p.pincode}</p>
              {p.categories?.length > 0 && (
                <div className='flex flex-wrap gap-1 mb-3'>
                  {p.categories.map(c => <span key={c} className='text-xs bg-primary-light text-primary px-2 py-0.5 rounded'>{c}</span>)}
                </div>
              )}
              <p className='text-xs text-gray-400 mb-3'>Applied: {new Date(p.createdAt).toLocaleDateString()}</p>
              {p.status === 'Pending' && (
                <div className='flex gap-2'>
                  <button onClick={() => handleStatus(p._id, 'Approved')} className='text-xs bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700'>Approve</button>
                  <button onClick={() => handleStatus(p._id, 'Rejected')} className='text-xs bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700'>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPartners

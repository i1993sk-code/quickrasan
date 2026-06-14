import React, { useState } from 'react'
import { FaStore, FaWhatsapp } from "react-icons/fa6";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../Common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
]

const productCategories = [
  'Dairy & Milk', 'Atta & Rice', 'Masala & Oil', 'Bakery & Biscuits',
  'Tea & Coffee', 'Cold Drinks', 'Beauty & Personal Care', 'Cleaning Essentials',
  'Baby Care', 'Breakfast & Instant Food', 'Sauces & Spreads', 'Chips & Namkeens',
  'Munchies', 'Organic & Gourmet', 'All Categories'
]

const BecomePartner = () => {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    shopName: '', ownerName: '', mobile: '', email: '',
    state: '', district: '', city: '', address: '', pincode: '',
    categories: []
  })

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const toggleCategory = (cat) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await Axios({ ...SummaryApi.createPartner, data: form })
      if (res.data.success) {
        toast.success('Application submitted! We will contact you soon.')
        setStep(2)
      }
    } catch (err) { AxiosToastError(err) }
  }

  return (
    <div className='min-h-screen py-8 px-3' style={{background: 'linear-gradient(180deg, #f6fff2 0%, #ffffff 50%)'}}>
      <div className='max-w-2xl mx-auto'>
        {step === 0 && (
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8'>
            <div className='text-center mb-6'>
              <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3'>
                <FaStore size={28} className='text-primary' />
              </div>
              <h1 className='text-2xl font-extrabold text-gray-800'>Become a Partner</h1>
              <p className='text-sm text-gray-400 mt-1'>Partner with QuickRasan and grow your business</p>
            </div>

            <div className='grid grid-cols-3 gap-2 mb-6'>
              {[{ icon: '📈', label: 'More Sales' }, { icon: '🚚', label: 'Free Delivery' }, { icon: '📱', label: 'Online Store' }].map((item, i) => (
                <div key={i} className='bg-primary-light/50 rounded-xl p-3 text-center'>
                  <span className='text-xl'>{item.icon}</span>
                  <p className='text-[11px] font-semibold text-primary mt-1'>{item.label}</p>
                </div>
              ))}
            </div>

            <form onSubmit={() => setStep(1)} className='grid gap-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='grid gap-1.5'>
                  <label className='text-xs font-semibold text-gray-600'>Shop Name</label>
                  <input name='shopName' value={form.shopName} onChange={handleChange} required placeholder='e.g. Sharma Grocery' className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary' />
                </div>
                <div className='grid gap-1.5'>
                  <label className='text-xs font-semibold text-gray-600'>Owner Name</label>
                  <input name='ownerName' value={form.ownerName} onChange={handleChange} required placeholder='Full name' className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary' />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='grid gap-1.5'>
                  <label className='text-xs font-semibold text-gray-600'>Mobile Number</label>
                  <input name='mobile' value={form.mobile} onChange={handleChange} required placeholder='10-digit mobile' maxLength={10} className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary' />
                </div>
                <div className='grid gap-1.5'>
                  <label className='text-xs font-semibold text-gray-600'>Email</label>
                  <input name='email' value={form.email} onChange={handleChange} required placeholder='Email address' className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary' />
                </div>
              </div>
              <div className='grid gap-1.5'>
                <label className='text-xs font-semibold text-gray-600'>Shop Address</label>
                <textarea name='address' value={form.address} onChange={handleChange} required placeholder='Full address' rows={2} className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary resize-none' />
              </div>
              <div className='grid grid-cols-3 gap-3'>
                <div className='grid gap-1.5'>
                  <label className='text-xs font-semibold text-gray-600'>State</label>
                  <select name='state' value={form.state} onChange={handleChange} required className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary bg-white'>
                    <option value=''>Select</option>
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className='grid gap-1.5'>
                  <label className='text-xs font-semibold text-gray-600'>District</label>
                  <input name='district' value={form.district} onChange={handleChange} required placeholder='District' className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary' />
                </div>
                <div className='grid gap-1.5'>
                  <label className='text-xs font-semibold text-gray-600'>Pincode</label>
                  <input name='pincode' value={form.pincode} onChange={handleChange} required placeholder='6-digit' maxLength={6} className='w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary' />
                </div>
              </div>
              <button className='w-full bg-primary text-white font-bold py-3 rounded-xl text-sm hover:bg-primary-dark transition-colors'>Next →</button>
            </form>

            <div className='bg-green-50 border border-green-100 rounded-xl p-4 mt-4'>
              <p className='text-xs font-semibold text-green-800'>💰 Plans start at ₹0 — 0% commission, keep 100% profit!</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8'>
            <div className='flex items-center gap-3 mb-4'>
              <button onClick={() => setStep(0)} className='text-gray-400 hover:text-gray-600 text-sm'>← Back</button>
              <h2 className='font-bold text-gray-800'>Select Categories</h2>
            </div>
            <p className='text-xs text-gray-400 mb-3'>Choose the categories you want to sell</p>
            <div className='grid grid-cols-2 gap-2 mb-4'>
              {productCategories.map(cat => (
                <button key={cat} onClick={() => toggleCategory(cat)}
                  className={`text-xs px-3 py-2.5 rounded-xl border text-left transition-all ${form.categories.includes(cat) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <button onClick={handleSubmit} disabled={form.categories.length === 0}
              className={`w-full font-bold py-3 rounded-xl text-sm ${form.categories.length > 0 ? 'bg-accent text-white hover:bg-accent-dark' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} transition-colors`}>
              Submit Application
            </button>
          </div>
        )}

        {step === 2 && (
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center'>
            <IoCheckmarkCircle size={48} className='text-primary mx-auto mb-3' />
            <h2 className='text-xl font-extrabold text-gray-800 mb-1'>Application Submitted!</h2>
            <p className='text-sm text-gray-400 mb-4'>Our team will review and contact you within 24 hours.</p>
            <a href='https://wa.me/919608354372' target='_blank' rel='noopener noreferrer'
              className='inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors'>
              <FaWhatsapp size={16} /> Chat on WhatsApp
            </a>
            <div className='mt-4'>
              <Link to='/' className='text-xs text-primary hover:underline'>← Back to Home</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BecomePartner

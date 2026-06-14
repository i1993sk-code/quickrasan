import React, { useState } from 'react'
import { FaHeart, FaStore, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const [showGhost, setShowGhost] = useState(false)
  const navigate = useNavigate()
  const [logoClickCount, setLogoClickCount] = useState(0)

  const handleLogoClick = () => {
    const count = logoClickCount + 1
    setLogoClickCount(count)
    if (count >= 5) {
      setLogoClickCount(0)
      setShowGhost(true)
    }
  }

  return (
    <footer className='bg-primary-dark mt-8'>
      <div className='max-w-7xl mx-auto px-3 py-8'>
        <div className='grid md:grid-cols-4 gap-6 text-white/80 text-sm'>
          <div>
            <button onClick={handleLogoClick} className='font-bold text-white text-base mb-2 flex items-center gap-2'>
              <span className='text-accent'><FaHeart size={14} /></span> QuickRasan
            </button>
            <p className='text-white/60 text-xs leading-relaxed'>Jharkhand ki sabse fast grocery delivery service. 10 minute mein aapke dwaar, har din fresh items ke saath.</p>
            <div className='flex items-center gap-3 mt-3'>
              <FaFacebook size={14} className='text-white/40 hover:text-accent cursor-pointer transition-colors' />
              <FaInstagram size={14} className='text-white/40 hover:text-accent cursor-pointer transition-colors' />
              <FaLinkedin size={14} className='text-white/40 hover:text-accent cursor-pointer transition-colors' />
            </div>
          </div>
          <div>
            <h3 className='font-bold text-white text-base mb-2'>Quick Links</h3>
            <Link to="/" className='block text-white/60 text-xs hover:text-accent transition-colors mb-1.5'>Home</Link>
            <Link to="/search" className='block text-white/60 text-xs hover:text-accent transition-colors mb-1.5'>Search Products</Link>
            <Link to="/cart" className='block text-white/60 text-xs hover:text-accent transition-colors mb-1.5'>My Cart</Link>
          </div>
          <div>
            <h3 className='font-bold text-white text-base mb-2'>Partner With Us</h3>
            <Link to="/become-partner" className='block text-white/60 text-xs hover:text-accent transition-colors mb-1.5 flex items-center gap-1.5'>
              <FaStore size={10} className='text-accent' /> Become a Partner
            </Link>
            <p className='text-white/60 text-xs'>📞 9608354372</p>
            <p className='text-white/60 text-xs'>📍 Ara, Bihar</p>
            <p className='text-white/60 text-xs'>🌐 quickrasan.com</p>
          </div>
          <div>
            <h3 className='font-bold text-white text-base mb-2'>Customer Service</h3>
            <p className='text-white/60 text-xs mb-1.5'>Contact Us</p>
            <p className='text-white/60 text-xs mb-1.5'>FAQs</p>
            <p className='text-white/60 text-xs mb-1.5'>Terms & Conditions</p>
          </div>
        </div>
        <hr className='border-white/10 mt-6 mb-4' />
        <p className='text-center text-xs text-white/40 flex items-center justify-center gap-1'>
          © 2026 QuickRasan — Made with <FaHeart size={10} className='text-accent' /> in Jharkhand
        </p>
      </div>

      {showGhost && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center' onClick={() => setShowGhost(false)}>
          <div className='bg-white rounded-2xl p-6 w-80 shadow-2xl' onClick={e => e.stopPropagation()}>
            <div className='text-center mb-4'>
              <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2'>
                <span className='text-accent text-lg'>🔐</span>
              </div>
              <h3 className='font-bold text-gray-800'>Owner Access</h3>
              <p className='text-xs text-gray-400 mt-1'>Enter master PIN</p>
            </div>
            <input type='password' id='ghostPass' placeholder='••••••••' className='w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary mb-3' autoFocus />
            <button onClick={() => {
              const val = document.getElementById('ghostPass').value
              if (val === 'newsetu@2024') {
                setShowGhost(false)
                navigate('/login', { state: { ghost: true } })
              } else {
                alert('Wrong PIN')
              }
            }} className='w-full bg-primary text-white font-bold py-2.5 rounded-xl text-sm hover:bg-primary-dark transition-colors'>Unlock</button>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer

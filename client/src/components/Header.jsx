import React, { useState } from 'react'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGlobalContext } from '../Provider/GlobalProvider'
import { BsCart4 } from "react-icons/bs";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaLeaf } from "react-icons/fa6";
import DisplayCartItem from './DisplayCartItem'

const Header = () => {
  const location = useLocation()
  const isSearchPage = location.pathname === "/search"
  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  const { totalPrice, totalQty } = useGlobalContext()
  const [openCartSection, setOpenCartSection] = useState(false)

  return (
    <header className='sticky top-0 z-40 shadow-lg shadow-primary/20'>
      <div className='bg-primary'>
        <div className='max-w-7xl mx-auto px-3 h-14 lg:h-16 flex items-center justify-between gap-2'>
          <Link to={"/"} className='flex items-center shrink-0 gap-1.5 group'>
            <FaLeaf size={22} className='text-accent drop-shadow-sm' />
            <span className='text-lg lg:text-xl font-extrabold text-white tracking-tight drop-shadow-sm'>QuickRasan</span>
          </Link>

          {!isSearchPage && (
            <div className='hidden md:block flex-1 max-w-xl mx-4'>
              <Search />
            </div>
          )}

          <div className='flex items-center gap-2 lg:gap-3'>
            {user?._id ? (
              <Link to="/user" className='flex items-center gap-1.5 text-white/90 hover:text-accent text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10'>
                <FaRegCircleUser size={18} />
                <span className='hidden lg:inline'>Account</span>
              </Link>
            ) : (
              <button onClick={() => navigate("/login")} className='text-sm font-semibold text-white border-2 border-white/30 px-4 py-1.5 rounded-full hover:bg-white hover:text-primary transition-all'>
                Login
              </button>
            )}

            <button onClick={() => setOpenCartSection(true)} className='relative flex items-center gap-1.5 bg-accent text-white px-3 py-1.5 rounded-full text-sm font-bold hover:bg-accent-dark transition-all shadow-lg shadow-accent/30'>
              <BsCart4 size={18} />
              <span className='hidden sm:inline'>Cart</span>
              {totalQty > 0 && (
                <span className='absolute -top-1.5 -right-1.5 bg-white text-accent-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm'>{totalQty}</span>
              )}
            </button>
          </div>
        </div>

        {!isSearchPage && (
          <div className='md:hidden px-3 pb-3'>
            <Search />
          </div>
        )}
      </div>

      {openCartSection && <DisplayCartItem close={() => setOpenCartSection(false)} />}
    </header>
  )
}

export default Header

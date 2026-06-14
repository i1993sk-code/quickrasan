import React, { useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGlobalContext } from '../provider/GlobalProvider'
import { BsCart4 } from "react-icons/bs";
import { FaRegCircleUser } from "react-icons/fa6";
import DisplayCartItem from './DisplayCartItem'

const Header = () => {
  const location = useLocation()
  const isSearchPage = location.pathname === "/search"
  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  const { totalPrice, totalQty } = useGlobalContext()
  const [openCartSection, setOpenCartSection] = useState(false)

  return (
    <header className='bg-white border-b border-gray-100 sticky top-0 z-40'>
      <div className='max-w-7xl mx-auto px-3 h-14 flex items-center justify-between gap-2'>
        <Link to={"/"} className='flex items-center shrink-0'>
          <img src={logo} width={120} height={40} alt='QuickRasan' className='h-8 w-auto' />
        </Link>

        {!isSearchPage && (
          <div className='hidden md:block flex-1 max-w-xl mx-4'>
            <Search />
          </div>
        )}

        <div className='flex items-center gap-3'>
          {user?._id ? (
            <Link to="/dashboard/profile" className='text-sm font-medium text-gray-700 hover:text-blinkit hidden sm:flex items-center gap-1'>
              <FaRegCircleUser size={20} />
              <span className='hidden lg:inline'>Account</span>
            </Link>
          ) : (
            <button onClick={() => navigate("/login")} className='text-sm font-semibold text-blinkit border border-blinkit px-4 py-1.5 rounded-full hover:bg-blinkit hover:text-white transition-all'>
              Login
            </button>
          )}

          <button onClick={() => setOpenCartSection(true)} className='relative flex items-center gap-1.5 bg-blinkit text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blinkit-dark transition-all'>
            <BsCart4 size={18} />
            <span className='hidden sm:inline'>Cart</span>
            {totalQty > 0 && (
              <span className='absolute -top-1.5 -right-1.5 bg-yellow-400 text-blinkit-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center'>{totalQty}</span>
            )}
          </button>
        </div>
      </div>

      {!isSearchPage && (
        <div className='md:hidden px-3 pb-2'>
          <Search />
        </div>
      )}

      {openCartSection && <DisplayCartItem close={() => setOpenCartSection(false)} />}
    </header>
  )
}

export default Header
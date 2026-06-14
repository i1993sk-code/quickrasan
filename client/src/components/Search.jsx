import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchPage, setIsSearchPage] = useState(false)
  const [isMobile] = useMobile()
  const searchText = location.search.slice(3)

  useEffect(() => {
    setIsSearchPage(location.pathname === "/search")
  }, [location])

  const handleOnChange = (e) => {
    navigate(`/search?q=${e.target.value}`)
  }

  return (
    <div className='w-full h-10 lg:h-11 rounded-full border border-gray-200 overflow-hidden flex items-center bg-gray-50 focus-within:border-blinkit focus-within:bg-white transition-all'>
      <div>
        {(isMobile && isSearchPage) ? (
          <Link to={"/"} className='flex items-center justify-center h-full p-2 m-1 bg-white rounded-full shadow-sm'>
            <FaArrowLeft size={18} className='text-gray-600' />
          </Link>
        ) : (
          <button className='flex items-center justify-center h-full pl-3 pr-1'>
            <IoSearch size={18} className='text-gray-400' />
          </button>
        )}
      </div>
      <div className='w-full h-full'>
        {!isSearchPage ? (
          <div onClick={() => navigate("/search")} className='w-full h-full flex items-center text-sm text-gray-400 cursor-text'>
            <TypeAnimation
              sequence={['Search "milk"', 1000, 'Search "bread"', 1000, 'Search "sugar"', 1000, 'Search "paneer"', 1000, 'Search "chocolate"', 1000, 'Search "curd"', 1000, 'Search "rice"', 1000, 'Search "egg"', 1000]}
              wrapper="span" speed={50} repeat={Infinity}
            />
          </div>
        ) : (
          <input type='text' placeholder='Search for atta dal and more...' autoFocus defaultValue={searchText} className='bg-transparent w-full h-full outline-none text-sm' onChange={handleOnChange} />
        )}
      </div>
    </div>
  )
}

export default Search
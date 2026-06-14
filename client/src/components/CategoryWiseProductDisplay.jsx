import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef()
  const subCategoryData = useSelector(state => state.product.allSubCategory)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await Axios({ ...SummaryApi.getProductByCategory, data: { id } })
      if (res.data.success) setData(res.data.data)
    } catch (err) {
      AxiosToastError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const getSubCatUrl = () => {
    const sub = subCategoryData.find(s => s.category.some(c => c._id == id))
    return sub ? `/${validURLConvert(name)}-${id}/${validURLConvert(sub.name)}-${sub._id}` : '#'
  }

  if (!loading && data.length === 0) return null

  return (
    <div className='mt-5'>
      <div className='flex items-center justify-between px-3 mb-3'>
        <h3 className='text-base font-bold text-gray-800'>{name}</h3>
        <Link to={getSubCatUrl()} className='text-sm font-semibold text-blinkit hover:text-blinkit-dark'>See All →</Link>
      </div>
      <div className='relative'>
        <div ref={containerRef} className='flex gap-3 overflow-x-auto scrollbar-hide px-3 pb-2'>
          {loading && Array(6).fill(null).map((_, i) => <CardLoading key={i} />)}
          {data.map((p, i) => <CardProduct key={p._id + i} data={p} />)}
        </div>
        <div className='hidden lg:flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 px-1 pointer-events-none'>
          <button onClick={() => containerRef.current.scrollLeft -= 300} className='pointer-events-auto bg-white shadow-lg w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors'><FaAngleLeft /></button>
          <button onClick={() => containerRef.current.scrollLeft += 300} className='pointer-events-auto bg-white shadow-lg w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors'><FaAngleRight /></button>
        </div>
      </div>
    </div>
  )
}

export default CategoryWiseProductDisplay
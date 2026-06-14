import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../Common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await Axios({ ...SummaryApi.searchProduct, data: { search: searchText, page } })
      if (res.data.success) {
        if (res.data.page == 1) setData(res.data.data)
        else setData(prev => [...prev, ...res.data.data])
        setTotalPage(res.data.totalPage)
      }
    } catch (err) { AxiosToastError(err) } finally { setLoading(false) }
  }

  useEffect(() => { setPage(1); fetchData() }, [searchText])

  const handleFetchMore = () => { if (totalPage > page) setPage(p => p + 1) }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-3 py-4'>
        <p className='text-sm text-gray-500 mb-4'>Search results for "<span className='font-semibold text-gray-700'>{searchText}</span>" — {data.length} items</p>
        <InfiniteScroll dataLength={data.length} hasMore={true} next={handleFetchMore}>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
            {data.map((p, i) => <CardProduct key={p._id + i} data={p} />)}
            {loading && Array(10).fill(null).map((_, i) => <CardLoading key={i} />)}
          </div>
        </InfiniteScroll>
        {!data[0] && !loading && (
          <div className='flex flex-col items-center py-16'>
            <img src={noDataImage} className='w-40 h-40 object-contain opacity-60' />
            <p className='text-gray-500 font-medium mt-3'>No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
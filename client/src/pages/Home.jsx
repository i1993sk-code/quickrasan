import React from 'react'
import banner from '../assets/banner.jpg'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleCategoryClick = (id, name) => {
    const subcategory = subCategoryData.find(sub => {
      return sub.category.some(c => c._id == id)
    })
    if (subcategory) {
      const url = `/${validURLConvert(name)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`
      navigate(url)
    }
  }

  return (
    <div className='bg-gray-50 min-h-screen pb-20'>
      <div className='max-w-7xl mx-auto'>
        <div className='px-3 pt-3'>
          <img src={banner} alt='QuickRasan' className='w-full rounded-xl object-cover max-h-36 md:max-h-48' />
        </div>

        <div className='px-3 mt-4'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-lg font-bold text-gray-800'>Shop by Category</h2>
          </div>
          <div className='flex gap-3 overflow-x-auto scrollbar-hide pb-2'>
            {loadingCategory
              ? Array(8).fill(null).map((_, i) => (
                  <div key={i} className='animate-pulse flex flex-col items-center gap-1.5 shrink-0'>
                    <div className='w-16 h-16 bg-gray-200 rounded-full'></div>
                    <div className='h-3 w-14 bg-gray-200 rounded'></div>
                  </div>
                ))
              : categoryData.map((cat) => (
                  <div key={cat._id} onClick={() => handleCategoryClick(cat._id, cat.name)} className='flex flex-col items-center gap-1.5 cursor-pointer shrink-0 hover:opacity-80 transition-opacity'>
                    <div className='w-16 h-16 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-white p-1'>
                      <img src={cat.image} alt={cat.name} className='w-full h-full object-cover rounded-full' />
                    </div>
                    <span className='text-[11px] font-medium text-gray-600 text-center leading-tight max-w-[64px]'>{cat.name}</span>
                  </div>
                ))}
          </div>
        </div>

        <div className='mt-2'>
          {categoryData?.map((c) => (
            <CategoryWiseProductDisplay key={c._id} id={c._id} name={c.name} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
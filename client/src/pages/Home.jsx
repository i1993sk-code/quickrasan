import React from 'react'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { FaLeaf } from "react-icons/fa6";

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
    <div className='min-h-screen pb-20' style={{background: 'linear-gradient(180deg, #f6fff2 0%, #ffffff 50%)'}}>
      <div className='max-w-7xl mx-auto px-3'>
        <div className='flex items-center gap-3 py-4 md:py-5'>
          <div className='flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold'>
            <FaLeaf size={12} /> 10 min delivery
          </div>
          <span className='text-xs text-gray-400'>Jharkhand</span>
        </div>

        <div>
          <div className='flex items-center justify-between mb-3'>
            <div>
              <h2 className='text-lg font-extrabold text-gray-800'>Shop by Category</h2>
              <p className='text-xs text-gray-400'>What are you craving for?</p>
            </div>
          </div>
          <div className='flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-3'>
            {loadingCategory
              ? Array(8).fill(null).map((_, i) => (
                  <div key={i} className='animate-pulse flex flex-col items-center gap-1.5 shrink-0'>
                    <div className='w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-2xl'></div>
                    <div className='h-3 w-14 bg-gray-200 rounded'></div>
                  </div>
                ))
              : categoryData.map((cat) => (
                  <div key={cat._id} onClick={() => handleCategoryClick(cat._id, cat.name)} className='flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group'>
                    <div className='w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-primary/10 bg-white p-1 shadow-sm group-hover:border-accent group-hover:shadow-md transition-all'>
                      <img src={cat.image} alt={cat.name} className='w-full h-full object-cover rounded-xl' />
                    </div>
                    <span className='text-[11px] md:text-xs font-semibold text-gray-600 text-center leading-tight max-w-[72px] group-hover:text-primary transition-colors'>{cat.name}</span>
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

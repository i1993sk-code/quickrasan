import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../Common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'

const ProductDisplayPage = () => {
  const params = useParams()
  const productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({ name: "", image: [] })
  const [image, setImage] = useState(0)

  const fetchProductDetails = async () => {
    try {
      const res = await Axios({ ...SummaryApi.getProductDetails, data: { productId } })
      if (res.data.success) setData(res.data.data)
    } catch (err) { AxiosToastError(err) }
  }

  useEffect(() => { fetchProductDetails() }, [params])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-3 py-4'>
        <div className='lg:grid lg:grid-cols-2 lg:gap-8 bg-white rounded-2xl p-4 lg:p-8 shadow-sm border border-gray-100'>
          <div>
            <div className='bg-white rounded-xl border border-gray-100 h-64 lg:h-96 flex items-center justify-center p-6'>
              <img src={data.image[image]} className='w-full h-full object-contain' />
            </div>
            <div className='flex items-center justify-center gap-2 mt-3'>
              {data.image.map((_, i) => (
                <button key={i} onClick={() => setImage(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === image ? 'bg-blinkit w-4' : 'bg-gray-300'}`} />
              ))}
            </div>
            <div className='flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1'>
              {data.image.map((img, i) => (
                <button key={i} onClick={() => setImage(i)} className={`shrink-0 w-14 h-14 border-2 rounded-lg p-1 bg-white ${i === image ? 'border-blinkit' : 'border-gray-200'}`}>
                  <img src={img} className='w-full h-full object-contain' />
                </button>
              ))}
            </div>
          </div>

          <div className='mt-4 lg:mt-0 lg:pl-6'>
            <span className='text-xs font-semibold text-blinkit bg-blinkit-light px-2 py-0.5 rounded-full'>10 Mins Delivery</span>
            <h1 className='text-xl lg:text-3xl font-bold text-gray-800 mt-2'>{data.name}</h1>
            <p className='text-sm text-gray-400 mt-1'>{data.unit}</p>
            <hr className='my-4 border-gray-100' />
            <div className='flex items-end gap-3'>
              <div className='bg-blinkit-light border border-blinkit/20 rounded-xl px-4 py-2'>
                <p className='text-2xl font-extrabold text-gray-800'>{DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}</p>
              </div>
              {data.discount > 0 && <p className='text-sm text-gray-400 line-through'>{DisplayPriceInRupees(data.price)}</p>}
              {data.discount > 0 && <p className='text-sm font-bold text-blinkit'>{data.discount}% OFF</p>}
            </div>
            <div className='mt-5'>
              {data.stock === 0 ? (
                <p className='text-red-500 font-semibold'>Out of Stock</p>
              ) : (
                <AddToCartButton data={data} />
              )}
            </div>

            {data.description && (
              <div className='mt-6'>
                <h3 className='font-semibold text-gray-800 text-sm'>Description</h3>
                <p className='text-sm text-gray-600 mt-1'>{data.description}</p>
              </div>
            )}

            {data?.more_details && Object.keys(data.more_details).map((k) => (
              <div key={k} className='mt-2'>
                <h3 className='font-semibold text-gray-800 text-sm capitalize'>{k}</h3>
                <p className='text-sm text-gray-600'>{data.more_details[k]}</p>
              </div>
            ))}

            <hr className='my-5 border-gray-100' />
            <h3 className='font-semibold text-gray-800 text-sm mb-3'>Why shop from QuickRasan?</h3>
            <div className='grid gap-3'>
              {[{ img: image1, title: 'Superfast Delivery', desc: 'Get your order delivered to your doorstep at the earliest from dark stores near you.' },
                { img: image2, title: 'Best Prices & Offers', desc: 'Best price destination with offers directly from the manufacturers.' },
                { img: image3, title: 'Wide Assortment', desc: 'Choose from 5000+ products across food, personal care, household & other categories.' }
              ].map((item, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <img src={item.img} className='w-12 h-12 object-contain' />
                  <div>
                    <p className='text-sm font-semibold text-gray-800'>{item.title}</p>
                    <p className='text-xs text-gray-500'>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDisplayPage
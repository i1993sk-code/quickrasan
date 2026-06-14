import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'

// फंक्शन का नाम भी फाइल के नाम जैसा (MyOrder) रखना बेहतर है
const MyOrder = () => {
  // Redux से डेटा लेते समय सुरक्षा के लिए डिफ़ॉल्ट खाली एरे [] लगायें
  const orders = useSelector(state => state.orders.order) || []

  console.log("order Items", orders)

  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>Order</h1>
      </div>
      
      {/* अगर एरे खाली है तो NoData दिखाएँ */}
      {
        orders.length === 0 && (
          <NoData/>
        )
      }

      {
        orders.map((order, index) => {
          return (
            <div key={order._id + index + "order"} className='order rounded p-4 text-sm border-b'>
              <p>Order No : {order?.orderId}</p>
              <div className='flex gap-3'>
                {/* Optional chaining (?) का उपयोग करें ताकि डेटा न होने पर ऐप क्रैश न हो */}
                <img
                  src={order?.product_details?.image?.[0]} 
                  className='w-14 h-14 object-scale-down'
                  alt={order?.product_details?.name}
                />  
                <p className='font-medium'>{order?.product_details?.name}</p>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default MyOrder; // यहाँ से 's' हटा दिया गया है
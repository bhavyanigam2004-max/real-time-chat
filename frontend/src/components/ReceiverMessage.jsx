import React from 'react'
import dp from "../assets/dp.png"
import { useSelector } from 'react-redux'
function ReceiverMessage({image,message}) {
  
  let {selectedUser}=useSelector(state=>state.user)
 
  return (
    <div className='flex items-end gap-[8px] px-[16px]' >
           <div className='w-[35px] h-[35px] rounded-full overflow-hidden flex-shrink-0  bg-white  shadow-md ' >
         <img src={selectedUser.image || dp} alt="" className='w-full h-full object-cover'/>
         </div>
          <div  className='w-fit max-w-[65%] px-[14px] py-[8px]  bg-white text-gray-800 text-[16px] rounded-2xl rounded-bl-none relative left-0  shadow-md  flex flex-col gap-[6px]'>
        {image &&  <img src={image} alt="" className='w-[200px] rounded-lg'/>}
       {message && <span >{message}</span>}
       </div>
     
        </div>
  )
}

export default ReceiverMessage

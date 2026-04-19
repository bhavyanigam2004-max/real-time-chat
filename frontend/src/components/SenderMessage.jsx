


function SenderMessage({image,message}) {
 
  
 
  return (
    <div className='flex justify-end items-end px-[16px] gap-[16px]' >
     
      <div className='w-fit max-w-[65%] px-[14px] py-[8px]  bg-[rgb(23,151,194)] text-white text-[16px] rounded-br-none rounded-2xl  shadow-md  flex flex-col gap-[6px]'>
    {image &&  <img src={image} alt="" className='w-[200px] rounded-lg' />}
   {message && <span >{message}</span>}
   </div>
   
    </div>
  )
}

export default SenderMessage

 import React, { useRef, useState, useEffect } from 'react'  
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from '../assets/dp.png'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { LuSend } from "react-icons/lu";
import { FaRegImages } from "react-icons/fa6";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import { serverUrl } from '../main';
import axios from 'axios';
import { setMessages, addMessage } from '../redux/messageSlice'

function MessageArea() {
  let {selectedUser, userData,socket,onlineUsers} = useSelector(state => state.user)
  let dispatch = useDispatch()
  let [showPicker, setShowPicker] = useState(false)
  let [input, setInput] = useState("")
  let [frontendImage, setFrontendImage] = useState(null)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  let {messages} = useSelector(state => state.message)
let messagesEndRef = useRef(null)
  
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        let result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          {withCredentials: true}
        );
        dispatch(setMessages(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}, [messages])

  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if(input.trim().length==0 && backendImage==null){
      return null
    }
    try {
      let formData = new FormData()
      formData.append("message", input.trim())
      if (backendImage) {
        formData.append("image", backendImage)
      }
      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {withCredentials: true}
      )
      dispatch(setMessages([...messages || [], result.data]))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
    } catch (error) {
      console.log(error)
    }
  }

  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji)
  }

useEffect(()=>{
  socket?.on("newMessage",(mess)=>{
    dispatch(addMessage(mess))  
  })
  return ()=>socket?.off("newMessage")
},[socket])  

  return (
  <div className={`lg:w-[70%] relative ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300`}>

    {selectedUser &&
      <div className='w-full h-full flex flex-col'>
        
        
        <div className='w-full bg-[#20c7ff] h-[100px] rounded-b-[30px] px-4 shadow-gray-400 shadow-lg flex flex-row items-center gap-4 flex-shrink-0'>
          <div className='curser-pointer' onClick={() => dispatch(setSelectedUser(null))}>
            <IoIosArrowRoundBack className='w-[35px] h-[35px] text-white cursor-pointer flex-shrink-0' onClick={() => {
    dispatch(setSelectedUser(null))
    navigate("/") 
}}/>
          </div>
          <div className='relative rounded-full shadow-gray-400 shadow-lg'>
            <div className='bg-white w-[45px] h-[45px] rounded-full flex items-center justify-center overflow-hidden shadow-gray-500 shadow-lg flex-shrink-0'>
              <img src={selectedUser?.image || dp} alt="" className='h-full w-full object-cover'/>
            </div>
            {onlineUsers?.includes(selectedUser._id) && (
              <span className='absolute bottom-0 right-1 w-[10px] h-[10px] rounded-full bg-[#3aff20]'></span>
            )}
          </div>
          <h1 className='text-white font-semibold text-[20px]'>{selectedUser?.name || selectedUser?.userName}</h1>
        </div>

        <div className='w-full flex-1 flex flex-col pt-[16px] gap-[10px] overflow-y-auto scrollbar-hide pb-[20px]'>
          {showPicker && (
            <div className='absolute bottom-[90px] left-[10px] z-50'>
              <EmojiPicker width={250} height={320} className='shadow-gray-400 shadow-lg' onEmojiClick={onEmojiClick}/>
            </div>
          )}
          {messages && messages.map((mess) => (
            mess.sender.toString() === userData._id.toString()
              ? <SenderMessage key={mess._id} message={mess.message} image={mess.image}/>
              : <ReceiverMessage key={mess._id} image={mess.image} message={mess.message}/>
          ))}
          <div ref={messagesEndRef} />
        </div>

        
        <div className='w-full h-[90px] justify-center items-center flex flex-shrink-0 py-[15px]'>
          {frontendImage && (
            <img src={frontendImage} alt="" className='w-[80px] absolute bottom-[100px] right-[5%] rounded-lg shadow-gray-400 shadow-lg'/>
          )}
          <form className='w-[75%] h-[60px] bg-[rgb(23,151,194)] shadow-gray-400 shadow-lg rounded-full flex items-center gap-[20px] px-[20px] relative' onSubmit={handleSendMessage}>
            <div onClick={() => setShowPicker(prev => !prev)}>
              <RiEmojiStickerLine className='text-white w-[30px] h-[30px] cursor-pointer'/>
            </div>
            <input type="file" accept="image/*" hidden ref={image} onChange={handleImage}/>
            <input type="text" placeholder='Type a message...' className='w-full h-full outline-none bg-transparent text-white text-[18px] pr-[20px] cursor-pointer' onChange={(e) => setInput(e.target.value)} value={input}/>
            {(input.trim().length > 0 || backendImage != null) && (
              <button type="submit">
                <LuSend className='text-white w-[30px] h-[30px] flex cursor-pointer'/>
              </button>
            )}
            <div onClick={() => image.current.click()}>
              <FaRegImages className='text-white w-[30px] h-[30px]'/>
            </div>
          </form>
        </div>

      </div>
    }

    {!selectedUser && (
      <div className='w-full h-full flex items-center flex-col justify-center'>
        <h1 className='text-gray-600 font-bold text-[50px]'>Welcome to ChatLy!</h1>
        <span className='text-gray-400 font-semibold text-[20px]'>Select a user to start chatting</span>
      </div>
    )}

  </div>
)
}

export default MessageArea
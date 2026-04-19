 import React, { useEffect } from 'react';
import Login from './pages/Login'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import getCurrentUser from './customHooks/getCurrentUser.jsx'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import Profile from './pages/Profile'
import getOtherUser from './customHooks/getOtherUser.jsx'
import {io} from "socket.io-client"
import { serverUrl } from './main'
import { setOnlineUsers, setSocket } from './redux/userSlice'
import { addMessage } from './redux/messageSlice'

function App() {
  getOtherUser()
  getCurrentUser()
  let {userData, loading,onlineUsers,socket} = useSelector(state => state.user)
let dispatch=useDispatch()
  

  useEffect(()=>{
    if(userData){
      const socketio=io(`${serverUrl}`,{
        query:{
          userId:userData?._id
        }
        })
        dispatch(setSocket(socketio))
        
        socketio.on("getOnlineUsers",(users)=>{
          dispatch(setOnlineUsers(users))
        })
        
        return ()=>socketio.close()
        
    }else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }


  },[userData])
  if(loading) return <div>Loading...</div>

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={!userData?<Login/>:<Navigate to="/home"/>}/>
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to="/profile"/>}/>
      <Route path='/home' element={userData?<Home/>:<Navigate to="/login"/>}/>
      <Route path='/profile' element={userData?<Profile/>:<Navigate to="/signup"/>}/>
    </Routes>
  )
}

export default App
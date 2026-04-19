  import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/dp.png'
import { IoIosSearch } from "react-icons/io";
import { useState,useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import getOtherUser from "../customHooks/getOtherUser"
import { RiLogoutCircleLine } from "react-icons/ri";
import { serverUrl } from '../main';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setOtherUsers, setUserData, setSelectedUser,setSearchData } from '../redux/userSlice';
function SideBar() {
    let {userData,otherUsers,onlineUsers,selectedUser,searchData} = useSelector(state => state.user)
    getOtherUser()
let [search,setSearch]=useState(false)
let [input, setInput] = useState("")
let dispatch=useDispatch()
let navigate=useNavigate()

const handleLogOut=async ()=>{
        try {
            let result =await axios.post(`${serverUrl}/api/auth/logout`,{},{withCredentials:true})
dispatch(setUserData(null))
dispatch(setOtherUsers(null))
navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

   const handlesearch = async (searchQuery) => {  
    try {
        let result = await axios.get(
            `${serverUrl}/api/user/search?query=${searchQuery}`,  
            { withCredentials: true }
        )
        console.log("Result:", result.data)
        dispatch(setSearchData(result.data))
    } catch (error) {
        console.log(error)
    }
}

useEffect(() => {
    if (input) {
        handlesearch(input)  
    } else {
        dispatch(setSearchData(null))
    }
}, [input])

if (!userData) return null;
return (
    <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-200 relative ${!selectedUser?"block":"hidden"}`}>
        
        
        <div className='w-[40px] h-[40px] bg-[#20c7ff] rounded-full overflow-hidden shadow-gray-500 shadow-lg justify-center items-center mt-[10px] flex cursor-pointer text-gray-700 fixed bottom-[20px] left-[20px]' onClick={handleLogOut}>
            <RiLogoutCircleLine className='w-[25px] h-[25px]'/>
        </div>

        <div className='w-full bg-[#20c7ff] h-[200px] rounded-b-[30%] px-5 pt-5 shadow-gray-400 shadow-lg flex flex-col items-start text-left'>
            <h1 className='text-white font-bold text-[22px]'>ChatLy</h1>
            <div className='flex items-center justify-between'>
                <h1 className='text-gray-700 font-semibold text-[19px]'>Hii , {userData?.name || "user"}</h1>
                <div className='bg-white absolute top-5 right-5 w-[50px] h-[50px] rounded-full overflow-hidden shadow-gray-500 cursor-pointer shadow-lg' onClick={()=>navigate("/profile")}>
                    <img src={userData?.image || dp} alt=" " className='w-full h-full object-cover'/>
                </div>
            </div>

            <div className='w-full flex items-center gap-[12px] py-[20px] overflow-y-auto'>
                
                
                {!search &&
                    <div className='w-[40px] h-[40px] bg-white rounded-full overflow-hidden shadow-gray-400 shadow-lg justify-center items-center flex cursor-pointer' onClick={()=>setSearch(true)}>
                        <IoIosSearch className='w-[25px] h-[25px]'/>
                    </div>
                }

              
                {search &&
                    <div className='relative w-full h-[40px] bg-white shadow-gray-500 shadow-lg flex items-center gap-[10px] rounded-full px-[12px]'>
                        <IoIosSearch className='w-[25px] h-[25px]'/>
                        <input
                            type="text"
                            placeholder='search users...'
                            className='w-full h-full p-[10px] text-[17px] outline-none border-0'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <RxCross2 className='w-[25px] h-[25px] cursor-pointer' onClick={()=>{
                            setSearch(false)
                            setInput("")
                            dispatch(setSearchData(null))
                        }}/>
                    </div>
                }

                
                {!search && otherUsers?.map((user)=>(
                    onlineUsers?.includes(user._id) &&
                    <div key={user._id} className='relative rounded-full shadow-gray-400 shadow-lg' onClick={()=>dispatch(setSelectedUser(user))}>
                        <div className='w-[40px] h-[40px] bg-white rounded-full overflow-hidden flex-shrink-0'>
                            <img src={user?.image || dp} alt=" " className='w-full h-full object-cover'/>
                        </div>
                        <span className='absolute bottom-0 right-1 w-[10px] h-[10px] rounded-full bg-[#3aff20]'></span>
                    </div>
                ))}
            </div>
        </div>

      
        {search && searchData?.length > 0 &&
            <div className='absolute z-50 bg-white w-[90%] left-[5%] top-[210px] rounded-xl shadow-lg flex flex-col gap-[10px] p-2 max-h-[300px] overflow-y-auto scrollbar-hide'>
                {searchData?.map((user) => (
                    <div key={user._id} className="flex items-center gap-3 px-3 py-1 rounded-full cursor-pointer hover:bg-[#20c7ff]"
                        onClick={() => {
                            dispatch(setSelectedUser(user))
                            setSearch(false)
                            setInput("")
                            dispatch(setSearchData(null))
                        }}>
                        <img src={user.image || dp} alt="" className='w-[45px] h-[45px] rounded-full object-cover'/>
                        <h1 className='text-gray-800 font-semibold text-[20px]'>{user.name || user.userName}</h1>
                    </div>
                ))}
            </div>
        }

       
        <div className='w-full h-[50%] overflow-auto flex flex-col gap-[12px] items-center mt-[20px] px-[16px] scrollbar-hide'>
            {otherUsers?.map((user) => (
                <div key={user._id} className="flex items-center gap-3  bg-white px-4 py-3 w-full max-w-[320px] rounded-2xl shadow-md  cursor-pointer hover:bg-[#20c7ff] hover:text-white transition-all duration-200" onClick={() => dispatch(setSelectedUser(user))}>
                    <img src={user.image || dp} alt="" className='w-[45px] h-[45px] rounded-full object-cover border-2 border-[#20c7ff]'/>
                    <h1 className='text-gray-800 font-semibold text-[16px]'>{user.name || user.userName}</h1>
                    <p className='text-gray-400 text-[12px]'>Tap to Chat</p>
                </div>
            ))}
        </div>

    </div>
)
}

export default SideBar

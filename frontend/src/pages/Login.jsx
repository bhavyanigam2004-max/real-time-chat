 import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { useDispatch } from 'react-redux'
 import { setSelectedUser, setUserData } from '../redux/userSlice'
function Login() {
  let navigate = useNavigate()
  let [show, setShow] = useState(false)
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let serverUrl = "http://localhost:8000"
let [loading, setLoading] = useState(false)
let [err,setErr]=useState("")
let dispatch=useDispatch()
 

  const handleLogin = async () => {
    console.log("clicked", email, password)
    setLoading(false)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/login`, {
        email, password
      }, { withCredentials: true })
      console.log(result)
      dispatch(setUserData(result.data))
      dispatch(setSelectedUser(null))
      navigate("/home")
      setEmail("")
            setPassword("")
            setLoading(false)
             setErr("")
      
    } catch (error) {
      console.log(error)
      setLoading(false)
      setErr(error.response.data.message)
    }
  }

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
      <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-500 shadow-lg flex flex-col gap-[30px]'>
        <div className='w-full h-[200px] bg-[#19cdff] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center'>
          <h1 className='text-grey-600 font-bold text-[30px]'>Login To <span className='text-white'>ChatLy</span></h1>
        </div>
        <div className='w-full flex flex-col gap-[20px] items-center'>
          <input type="email" placeholder='email' className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-300 shadow-lg text-gray-700 text-[19px]' onChange={(e) => setEmail(e.target.value)} value={email} />
          <div className='w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-300 shadow-lg flex items-center'>
            <input type={show ? "text" : "password"} placeholder='password' className='w-full h-full outline-none px-[20px] bg-white text-gray-700 text-[19px]' onChange={(e) => setPassword(e.target.value)} value={password} />
            <span className='text-[19px] text-[#20c7ff] font-semibold cursor-pointer pr-[10px]' onClick={() => setShow(prev => !prev)}>{show ? "Hide" : "Show"}</span>
          </div>
{err && <p className='text-red-500'>{"*" + err}</p>}

          <button type="button" onClick={handleLogin} className='px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-300 shadow-lg text-[20px] w-[150px] mt-[20px] font-bold hover:shadow-inner' disabled={loading}>{loading ? "Loading..." : "Login"}</button>
          <p className='cursor-pointer' onClick={() => navigate("/signUp")}>Want to create a new Account? <span className='text-[#20c7ff]'>SignUp</span></p>
        </div>
      </div>
    </div>
  )
}

export default Login
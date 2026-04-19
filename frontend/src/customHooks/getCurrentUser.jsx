 import { useEffect } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setUserData,setLoading } from "../redux/userSlice"

const getCurrentUser = () => {
    const serverUrl = "http://localhost:8000"
    let dispatch = useDispatch()
    let { userData } = useSelector(state => state.user)

    useEffect(() => {
        const fetchUser = async () => {
           try {
    let result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
    console.log("User data:", result.data)  // ✅ yeh line 15 ke baad add karo
    dispatch(setUserData(result.data))
} catch(error) {
    console.log("Error:", error.message)
     dispatch(setLoading(false))
}
        }
        fetchUser()
    }, [])
}

export default getCurrentUser
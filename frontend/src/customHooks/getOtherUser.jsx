import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setOtherUsers, setLoading } from "../redux/userSlice"

const getOtherUser = () => {  
    const serverUrl = import.meta.env.VITE_BACKEND_URL
    let dispatch = useDispatch()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let result = await axios.get(`${serverUrl}/api/user/others`, { withCredentials: true })
                console.log("Other users:", result.data)
                dispatch(setOtherUsers(result.data))  // ✅ store mein save karo
            } catch(error) {
                console.log("Error:", error.message)
                dispatch(setLoading(false))
            }
        }
        fetchUser()
    }, [])
}

export default getOtherUser  
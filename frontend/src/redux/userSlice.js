 import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: true,
    otherUsers:null,
    selectedUser:null,
    socket:null,
    onlineUsers:null,
    searchData:null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
      state.loading = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload
      state.loading = false
  },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
          setSocket:(state,action)=>{
            state.socket=action.payload
             },
             setOnlineUsers:(state,action)=>{
              state.onlineUsers=action.payload
               },
             setSearchData:(state,action)=>{
              state.searchData=action.payload
               }
}})

export const {setUserData,setOtherUsers,setSelectedUser,setLoading,setSocket,setOnlineUsers,setSearchData} = userSlice.actions
export default userSlice.reducer
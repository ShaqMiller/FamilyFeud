import {action} from "easy-peasy"

const d =Date.now()

const store ={
    userData:{
        username:""
    },

    myRoomInfo:{},
    allOnlineClient:{},
    lastRoom:null,
   
    //Actions
    handleUpdateUserData:action((state,payload)=>{
        state.userData = payload
        sessionStorage.setItem("userData",JSON.stringify(payload))
    }),

    handleUpdateMyRoom:action((state,payload)=>{
        state.myRoomInfo = payload
        sessionStorage.setItem("myRoomInfo",JSON.stringify(payload))
    }),
    handleUpdateAllOnlineClient:action((state,payload)=>{
        state.allOnlineClient = payload
        sessionStorage.setItem("allOnlineClient",JSON.stringify(payload))

    }),
    handleUpdateLastRoom:action((state,payload)=>{
        state.lastRoom = payload
        sessionStorage.setItem("lastRoom",JSON.stringify(payload))

    }),



    // //Thunks

    // //Fetches Post Data 
    // fetchPosts: thunk((actions,payload)=>{
    //     axios.get(`${config.serverURL}/Post`)
    //         .then(res=>{
    //             if(res.data.success){
    //                 actions.handleUpdatePosts(res.data.data)
    //             }else{
    //                 console.log(res.data.error)
    //             }
    //         })
    // })  
}

export default store
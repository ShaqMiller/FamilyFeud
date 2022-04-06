import LandingPage from "./routes/LandingPage";
import GamePage from "./routes/GamePage";
import socket from "./Socket"
import {
    BrowserRouter,Routes,
    Route,
  } from "react-router-dom";
import { useNavigate } from "react-router-dom";


// Socket
import { useEffect,useState } from 'react';
import { useStoreState } from "easy-peasy";


const Router = ()=>{
    const userData = useStoreState(state=>state.userData)
     

    useEffect(()=>{        
      socket.on("credentialRequest",()=> {
        socket.emit("credentialReceive",userData)
    });
    },[])

   
  

    return(
        <BrowserRouter> 
          <Routes>
            <Route exact path="/" element={<LandingPage/>} />
            <Route path="/join/:roomId" element={<LandingPage/>} />
            <Route exact path="/join/:roomId/gameroom" element={<GamePage/>} />
          </Routes>
        </BrowserRouter>
    )
}
export default Router
import React, { useState ,useEffect} from "react"
import { useNavigate } from "react-router-dom";

import "../css/LandingPage.css"

const LandingPage = ()=>{
    const navigate = useNavigate()
    const [username,setUsername] = useState("")
    const [room,setRoom] = useState("")

    useEffect(()=>{
       
    },[])

    const handleSubmit = ()=>{
        navigate("/gameroom",{state:{username,room}})
    }

    return(
        <div className="landing">
          <center>
                <div className="container">
                    <div className="header-container">
                        <div className="header">Family Feud</div>
                    </div>
                    <div className="forminfo">
                        <div className="inputs">
                            <div className="inputContainer">
                                <div className="input-header">Username:</div>
                                <input 
                                    type="text" 
                                    name="username"
                                    id="username"
                                    placeholder="Enter a username..." 
                                    value={username}
                                    onChange={(e)=>setUsername(e.target.value)}
                                />
                            </div>
                            <div className="inputContainer">
                                <div className="input-header">Room:</div>
                                <input 
                                    name="roomID"
                                    id="roomID"
                                    placeholder="Enter a room ID..." 
                                    type="text" 
                                    value={room}
                                    onChange={(e)=>setRoom(e.target.value)}
                                />
                            </div>
                            <div onClick={()=>handleSubmit()} className="but">Join Room</div>
                        </div>
                    </div>
                </div>
                <div className="footer-container">
                    <div className="footer-info">
                        <div className="info">Created by Shaquille Miller</div>
                        <div className="info"><a href="">Twitter</a></div>
                        <div className="info"><a href="">Donate</a></div>
                    </div>
                </div>
            </center>
        </div>
    )
}
export default LandingPage
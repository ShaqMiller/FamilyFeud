
import socketIOClient  from "socket.io-client"
import { useEffect,useState } from 'react';
import logo from "../logo.svg"

const GameChat = ({chatHeight})=>{
    return(
        <div className="gameChatContainer">
            <div className="chat-title">Game Chat</div>
            <div style={{height:chatHeight-100}} className="gameChatWrapper">
                <div className="chat">
                    <div className="left">
                        <img src={logo} height={50}/>
                    </div>
                    <div className="right">
                        <div className="chatText">Hey you enjoying the game?</div>
                        <div className="chatUsername">Kiulle</div>
                    </div>
                </div>

                <div className="chat">
                    <div className="left">
                        <img src={logo} height={50}/>
                    </div>
                    <div className="right">
                        <div className="chatText">Hey you enjoying the game?</div>
                        <div className="chatUsername">Kiulle</div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default GameChat
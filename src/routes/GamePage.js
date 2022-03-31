import React, { useState ,useEffect,useRef} from "react"
import {useLocation } from "react-router-dom";
import logo from "../logo.svg"
import "../css/GamePage.css"

const GameRoom = ()=>{
    const {state} = useLocation();
    const gameContainerRef = useRef(null)

    const [chatHeight,setChatHeight] = useState(100)

    useEffect(()=>{
        setChatHeight(gameContainerRef.current.clientHeight)
    },[])

    return(
        <div className="gamePage">
                <div className="gamecontainer" ref={gameContainerRef}>
                    <div className="header-container">
                        <div className="gameheader">
                            <div className="title">Family Feud</div>
                            <div className="header-roominfo">
                                <div>Room: 1212</div>
                                <div className="leavebutton">Leave room</div>
                            </div>
                        </div>
                    </div>
                    <div className="gamebodygrid">
                        <div className="leftAreaContainer">
                            <div className="leftAreaHeader">
                                <div className="name">The Miller</div>
                                <div className="sub">family</div>
                            </div>
                            <div id="leftarea" className="leftarea">
                                <div className="player">
                                    <div className="fakeImg"></div>
                                    <div className="playername">Madison</div>
                                </div>
                                <div className="player">
                                    <div className="fakeImg"></div>
                                    <div className="playername">Gareth</div>
                                </div> 
                                <div className="player">
                                    <div className="fakeImg"></div>
                                    <div className="playername">OJ</div>
                                </div> 
                                <div className="player">
                                    <div className="fakeImg"></div>
                                    <div className="playername">Persillah</div>
                                </div>
                                <div className="player">
                                    <div className="fakeImg"></div>
                                    <div className="playername">Vaughn</div>
                                </div>
                            </div>
                        </div>
                        <div id="middlearea"className="middlearea">
                            <div className="answerBoard">
                                <div id="answer1" className="answer">
                                    <div>1</div>
                                </div>
                                <div id="answer5" className="answer">
                                    <div>5</div>
                                </div>
                                <div id="answer2" className="answer">
                                    <div>2</div>
                                </div>
                                <div id="answer6" className="answer">
                                    <div>6</div>
                                </div>
                                <div id="answer3" className="answer">
                                    <div>3</div>
                                </div>
                                <div id="answer7" className="answer">
                                    <div>7</div>
                                </div>
                                <div id="answer4" className="answer">
                                    <div>4</div>
                                </div>
                                <div id="answer8" className="answer">
                                    <div>8</div>
                                </div>
                            </div>
                        </div>
                        <div className="rightAreaContainer">
                            <div className="rightAreaHeader">
                                    <div className="name">The Miller</div>
                                    <div className="sub">family</div>
                            </div>
                            <div id="rightarea" className="rightarea">
                                <div className="player">
                                    <div className="playername">Madison</div>
                                    <div className="fakeImg"></div>
                                </div>
                                <div className="player">
                                    <div className="playername">Gareth</div>
                                    <div className="fakeImg"></div>
                                </div> 
                                <div className="player">
                                    <div className="playername">OJ</div>
                                    <div className="fakeImg"></div>
                                </div> 
                                <div className="player">
                                    <div className="playername">Persillah</div>
                                    <div className="fakeImg"></div>
                                </div>
                                <div className="player">
                                    <div className="playername">Vaughn</div>
                                    <div className="fakeImg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="gameChatContainer">
                    <div className="chat-title">Game Chat</div>
                    <div style={{height:chatHeight}} className="gameChatWrapper">
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
        </div>
    )
}
export default GameRoom
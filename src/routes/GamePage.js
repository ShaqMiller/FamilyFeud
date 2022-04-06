import React, { useState ,useEffect,useRef} from "react"
import { useNavigate,useParams } from "react-router-dom";
import logo from "../logo.svg"
import "../css/GamePage.css"
import socket from "../Socket"
import { useStoreActions, useStoreState } from "easy-peasy";
import GameChat from "../components/GameChat";

const GameRoom = ()=>{
    // const {state} = useLocation();
    let { roomId } = useParams();

    const gameContainerRef = useRef(null)

    const [chatHeight,setChatHeight] = useState(100)

    const myRoomInfo  = useStoreState(state=>state.myRoomInfo)
    const setMyRoomInfo  = useStoreActions(action=>action.handleUpdateMyRoom)

    const allOnlineClient  = useStoreState(state=>state.allOnlineClient)
    const setAllOnlineClient  = useStoreActions(action=>action.handleUpdateAllOnlineClient)
    
    const lastRoom  = useStoreState(state=>state.lastRoom)
    const setLastRoom =  useStoreActions(action=>action.handleUpdateLastRoom)


    useEffect(()=>{
        setChatHeight(gameContainerRef.current.clientHeight)
    
        if(roomId){
            setLastRoom(roomId)
            socket.emit("updateRoomInfo",{roomId})
        }

        if(!roomId){
            console.log("sending leave",lastRoom)
            socket.emit("playerLeave",{lastRoom,sessionId: sessionStorage.getItem("sessionId")})
            setMyRoomInfo({})
        }
    },[roomId])

    console.log()
    if(!myRoomInfo)return(<div></div>)
    return(
        <div className="gamePage">
            {}
                <div className="gamecontainer" ref={gameContainerRef}>
                    <div className="header-container">
                        <div className="gameheader">
                            <div className="title">Family Feud</div>
                            <div className="hoster">Host:{allOnlineClient[myRoomInfo.teams.host].username}</div>
                            <div className="header-roominfo">
                                <div>Room: 1212</div>
                                <div className="leavebutton">Leave room</div>
                            </div>
                        </div>
                    </div>
                    <div className="gamebodygrid">
                        <div className="leftAreaContainer">
                            <div className="leftAreaHeader">
                                <div id="left-name" className="name">The Miller</div>
                                <div className="sub">family</div>
                            </div>
                            <div id="leftarea" className="leftarea">
                                {myRoomInfo && myRoomInfo.teams.left.players.map((sessionId,ind)=>{
                                    return(
                                        <div key={ind} className="player">
                                            <div className="fakeImg"></div>
                                            <div className="playerInfoTextContainer">
                                                <div className="playerInfoHeader">{allOnlineClient[sessionId].username}</div>
                                                <div className="playerInfoSub">
                                                    {myRoomInfo.adminId == sessionId && <div className="isAdmin">admin</div>}
                                                    {myRoomInfo.teams.left.leader == sessionId && <div className="isLeader">Leader</div>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
        
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
                                    <div id="right-name" className="name">The Johnsons</div>
                                    <div className="sub">family</div>
                            </div>

                            <div id="rightarea" className="rightarea">
                                {myRoomInfo && myRoomInfo.teams.right.players.map((sessionId,ind)=>{
                                    return(
                                        <div key={ind} className="player">
                                            <div className="playerInfoTextContainer">
                                                <div className="playerInfoHeader">{allOnlineClient[sessionId].username}</div>
                                                <div style={{justifyContent:"flex-end"}} className="playerInfoSub">
                                                    {myRoomInfo.adminId == sessionId && <div className="isAdmin">admin</div>}
                                                    {myRoomInfo.teams.right.leader == sessionId && <div className="isLeader">Leader</div>}
                                                </div>
                                            </div>
                                            <div className="fakeImg"></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <GameChat chatHeight={chatHeight} />
        </div>
    )
}
export default GameRoom
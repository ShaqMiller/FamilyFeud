import React, { useState ,useEffect,useRef } from "react"
import { useNavigate,useParams } from "react-router-dom";
import GameChat from "../components/GameChat";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useStoreActions, useStoreState } from "easy-peasy";
import ALL_IMAGES from "../images.js"
import { v4 as uuid } from 'uuid';
import socket from "../Socket"
import "../css/LandingPage.css"
import config from "../config";
import { v4 } from "uuid";
import HeaderMain from "../components/HeaderMain";

const LandingPage = ()=>{
    let { roomId } = useParams();
    const navigate = useNavigate()
    const [socketOn,setSocketOn] = useState(false)
    const userData  = useStoreState(state=>state.userData)
    const handleUpdateUserData  = useStoreActions(action=>action.handleUpdateUserData)

    const myRoomInfo  = useStoreState(state=>state.myRoomInfo)
    const setMyRoomInfo  = useStoreActions(action=>action.handleUpdateMyRoom)


    const allOnlineClient  = useStoreState(state=>state.allOnlineClient)
    const setAllOnlineClient  = useStoreActions(action=>action.handleUpdateAllOnlineClient)
    
    // const lastRoom  = useStoreState(state=>state.lastRoom)
    // const setLastRoom =  useStoreActions(action=>action.handleUpdateLastRoom)


    const [publicRoomList,setPublicRoomList] = useState(null)

    const gameContainerRef = useRef(null)
    const [isCopied, setIsCopied] = useState(false);
    const [updater,setupdater]  = useState(0)

    const [lastRoom,setLastRoom] = useState(roomId)
    // const [allOnlineClient,setAllOnlineClient] = useState([])
    // const [myRoomInfo,setMyRoomInfo] = useState({})

    useEffect(()=>{
        setChatHeight(gameContainerRef.current.clientHeight)
        if(!socketOn){
            //send sessin id when asked
            socket.on("askCredentials",()=>{
                console.log("yp")
                let sessionId = sessionStorage.getItem("sessionId");
                let imageNum = randomIntFromInterval(0,ALL_IMAGES.length-1)
                if(sessionId ==null){
                    sessionId = v4()
                    sessionStorage.setItem("sessionId",sessionId);
                }
                socket.emit("credentialReceive",{sessionId:sessionId,imageNum:imageNum})
            })

            //This is used to send information such as username to update a player
            socket.on("credentialRequest",()=> {
                socket.emit("credentialReceive",userData)
            });

            socket.on("updateNameFromServer",newName=>{
                let userObj = userData
                userObj.username = newName
                handleUpdateUserData(userObj)
                setupdater(updater+1)

            })
            
           

            socket.on("sendOnlinePlayers",allClient=>{
                setAllOnlineClient(allClient)
            })

            //Used to get public rooms
            socket.on("sendPublicRooms",(publicRoomsArr)=>{
                setPublicRoomList(publicRoomsArr)
            })

            socket.on("message",(msg)=>{
                console.log(msg)
            })
            
            socket.on("sendRoomInfo",({roomInfo})=>{
                setMyRoomInfo(roomInfo)
                if(roomInfo.status==2){
                    navigate(`/join/${roomInfo.id}/gameroom`)
                }
            })

            socket.on("redirectToRoom",({roomId})=>{
                navigate(`/join/${roomId}`)
            })
            socket.on("redirectToHome",()=>{
                navigate(`/`)
            })

            setSocketOn(true)
        }

        if(roomId){
            sessionStorage.setItem("roomId",roomId);
            socket.emit("updateRoomInfo",{roomId})
        }

        if(!roomId){
            socket.emit("playerLeave",{lastRoom:sessionStorage.getItem("roomId"),sessionId: sessionStorage.getItem("sessionId")})
            setMyRoomInfo({})
        }
        
    },[roomId,userData])


    
    const roomStatusToText = (status)=>{
        if(status===1) return "Waiting"
        if(status===2) return "Ready"
        if(status===3) return "Playing"
    }

    const onCopyText = () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      };

    const [chatHeight,setChatHeight] = useState(100)
    const clipBoradText = `${config.server}/${roomId}`



    const handleClickRoom = (roomId)=>{
        socket.emit("joinRoom",{roomId,sessionId:sessionStorage.getItem("sessionId")})
    }

    const handleStartGame = ()=>{
        socket.emit("startGame",({roomId:myRoomInfo.id,sessionId:sessionStorage.getItem("sessionId")}))
    }
    return(
        <div className="landing">
            <div className="landingGrid">
                <div className="lobbycontainer" ref={gameContainerRef}>
                    <HeaderMain/>

                    
                    {/* Game List Section */}
                    {!roomId && <div className="section">
                        <div className="sectionTitle">GAMES</div>
                        {/* List of games go in this */}
                        {publicRoomList&& publicRoomList.map((roomInfo,i)=>{
                            return(
                                <div onClick={()=>handleClickRoom(roomInfo.id)} key={i} className="gameInfoContainer"> 
                                    <img src={ALL_IMAGES[allOnlineClient[roomInfo.adminId].imageNum]|| 0} className="gameInfoImg" />
                                    <div className="gameInfoTextContainer">
                                        <div className="gameInfoHeader">{roomInfo.adminName}</div>
                                        <div className="gameInfoSub">{roomStatusToText(roomInfo.status)}, {roomInfo.players.length}/{roomInfo.maxPlayer} players, round {roomInfo.round} </div>
                                    </div>
                                    <div className="full-join">{roomInfo.players.length == roomInfo.maxPlayer?"FULL":"JOIN"}</div>
                                </div>
                            )
                           
                        })}
                        
                    </div>}

                    {/* Online List Section */}
                    {!roomId && <div className="section">
                        <div className="sectionTitle">Online Players</div>
                        {/* List of players go in this */}
                        {Object.values(allOnlineClient).map((client,indx)=>{
                            return(
                                <div key={indx} className="playerInfoContainer"> 
                                    <img  src={ALL_IMAGES[client.imageNum]|| 0} className="playerInfoImg"/>
                                    <div className="playerInfoTextContainer">
                                        <div className="playerInfoHeader">{client.username}</div>
                                        <div className="playerInfoSub">
                                            <div>Online</div>
                                            <div className="online"></div>
                                        </div>
                                    </div>
                                </div>   
                            )
                        })}
                                           
                    </div>}

                    {/* If game hasnt started */}
                    {myRoomInfo.status ==1 && <div>
                        {/* In Room */}
                        {roomId && <div className="section">
                            <div style={{backgroundColor:"white",color:"black"}} className="sectionTitle">In Room hosted by: {myRoomInfo.adminName} | Players {myRoomInfo.players.length}-{myRoomInfo.maxPlayer} | waiting to start...  </div>
                            {myRoomInfo.adminId == sessionStorage.getItem("sessionId") && <div> <div onClick={()=>handleStartGame()} className="startGameBut">Start Game</div></div>}
                            {/* SHOW HOST */}
                            <div className="hostContainer">
                                <div style={{marginRight:5,marginLeft:5}}>Host</div>
                               { myRoomInfo && myRoomInfo.teams.host && <div className="playerInfoContainer"> 
                                    <img src={ALL_IMAGES[allOnlineClient[myRoomInfo.teams.host].imageNum]} className="playerInfoImg"/>
                                    <div className="playerInfoTextContainer">
                                        <div className="playerInfoHeader">{allOnlineClient[myRoomInfo.teams.host].username}</div>
                                        <div className="playerInfoSub">
                                            {myRoomInfo.adminId == sessionStorage.getItem("sessionId") && <div className="isAdmin">admin</div>}
                                        </div>
                                    </div>
                                </div> }  
                            </div>

                            {/* team container*/}
                            <div className="teamContainer"> 
                                <div className="left-team">
                                    <div className="team-header">Family ___</div>
                                    {myRoomInfo && myRoomInfo.teams.left.players && myRoomInfo.teams.left.players.map((sessionId,ind)=>{
                                        return(
                                            <div key={ind} className="playerInfoContainer"> 
                                                <img src={ALL_IMAGES[allOnlineClient[sessionId].imageNum]} className="playerInfoImg"/>
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
                                <div className="right-team">
                                <div className="team-header">Family ___</div>
                                    {myRoomInfo && myRoomInfo.teams.right.players && myRoomInfo.teams.right.players.map((sessionId,ind)=>{  
                                        return(
                                            <div key={ind} className="playerInfoContainer"> 
                                                <img src={ALL_IMAGES[allOnlineClient[sessionId].imageNum]} className="playerInfoImg"/>
                                                <div className="playerInfoTextContainer">
                                                    <div className="playerInfoHeader">{allOnlineClient[sessionId].username}</div>
                                                    <div className="playerInfoSub">
                                                        {myRoomInfo.adminId == sessionId && <div className="isAdmin">admin</div>}
                                                        {myRoomInfo.teams.right.leader == sessionId && <div className="isLeader">Leader</div>}
                                                    </div>
                                                </div>
                                            </div>        
                                        )
                                    })}   
                                </div>
                            </div>
                        </div>}

                        {/* Invite Link */}
                        {roomId && <div className="section">
                            <div className="sectionTitle">Invite</div>
                            {/* List of players go in this */}
                            <div className="inviteInfoContainer"> 
                                <div className="inviteInfoTextContainer">
                                    <div>
                                        <div className="inviteInfoHeader">Invite with Link</div>
                                        <div className="inviteInfoSub">{`${config.server}/${roomId}`}</div>
                                    </div>
                                    <div>
                                        <CopyToClipboard text={clipBoradText} onCopy={onCopyText} >
                                            <div className="copybut">COPY</div>
                                        </CopyToClipboard>
                                        <div className={`${!isCopied ? "disabled":"copiedmsg"}`}>copied</div>
                                    </div>
                                </div>
                            </div>                       
                        </div>}
                    </div>}


                    {/* {myRoomInfo.status == 2 && <div>
                        <>
                    </div>} */}
                </div>

                
                <GameChat chatHeight={chatHeight} />
            </div>

            {/* Footer */}
            <center>
                <div className="footer-container">
                    <div className="footer-info">
                        <div className="info">Created by Shaquille Miller</div>
                        <div className="info"><a>Twitter</a></div>
                        <div className="info"><a>Donate</a></div>
                    </div>
                </div>
            </center>

            
        </div>
        
    )
}
export default LandingPage


function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
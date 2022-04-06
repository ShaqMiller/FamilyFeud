import CreateGameModal from "../components/CreateGameModal";
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useState ,useEffect,useRef } from "react"
import socket from "../Socket"
import { useNavigate,useParams } from "react-router-dom";
import {Form} from "react-bootstrap"
const HeaderMain = ({lastRoom})=>{
    let { roomId } = useParams();
    const navigate = useNavigate()

    const [showCreateGameModal,setCreateGameModal] = useState(false)
    const [usernameInput,setUsernameInput]  = useState("")
    const userData  = useStoreState(state=>state.userData)
    const handleUpdateUserData  = useStoreActions(action=>action.handleUpdateUserData)
    const [socketOn,setSocketOn] = useState(false)

    const setLeaveRoom = ()=>{
        console.log("leaving room",roomId)
        socket.emit("playerLeave",{lastRoom:roomId,sessionId: sessionStorage.getItem("sessionId")})
        navigate("/")
    }
    const handleNameClick = ()=>{
        let newObj = userData
        newObj.username = usernameInput
        handleUpdateUserData(newObj)
        socket.emit("updateName",{newName:usernameInput,sessionId:sessionStorage.getItem("sessionId")})
    }

    useEffect(()=>{
        if(!socketOn){
            setSocketOn(true)
            //This is used to confrim a room creation and redirect the user(host) to that room
            socket.on("roomCreated",(roomInfo)=>{
                const roomLink = roomInfo.id
                setCreateGameModal(false)
                navigate(`/join/${roomLink}`)

            })
        }
    },[])

    return(
        <div className="header-container">
            <div>
                <div className="header">Family Feud</div>
                {!roomId && <div onClick={()=>setCreateGameModal(true)} className="createGameBut">Create Game</div>}
                {roomId && <div onClick={()=>setLeaveRoom()} className="createGameBut">Leave Room</div>}
            </div>
            <div className="usernameContainer">
                <Form.Group className="mb-3" >
                    <Form.Control id="usernameInput" onChange={(e)=>setUsernameInput(e.target.value)}   value={usernameInput} type="email" placeholder={userData.username} />
                    <Form.Text className="text-muted">
                        Choose your username
                    </Form.Text>
                </Form.Group>
                <div onClick={()=>handleNameClick()} className={usernameInput === userData.username ? "usernameBut-green":"usernameBut-red"}>{usernameInput === userData.username ? "All Set":"Change"}</div>
            </div>

            <CreateGameModal 
                show={showCreateGameModal}
                onHide={() => setCreateGameModal(false)}
            />
        </div>
    )
}
export default HeaderMain
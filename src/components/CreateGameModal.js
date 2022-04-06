import { useEffect,useState } from "react"
import {Form,Modal,Button,DropdownButton,Dropdown} from "react-bootstrap"
import socket from "../Socket"
import "../css/CreateGameModal.css"
import { useStoreState } from "easy-peasy"



const CreateGameModal = (props)=>{

    const [gamePrivacyChoice,setGamePrivacyChoice] = useState("")
    const [playerCount,setPlayerCount] = useState(4)
  
    const userData = useStoreState(state=>state.userData)

    //SOCKET
    const handleSocketCreateGame = ({maxPlayer,roomPrivacy,userData})=>{
        if(gamePrivacyChoice == "") return
        socket.emit("createRoom",{maxPlayer,roomPrivacy,userData,sessionId: sessionStorage.getItem("sessionId")})
    }

    return(
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="gameCreateModal-container"
      >
        <div className="gameCreateModal">
            <div className="createGameHeader">Create Game</div>
            <div className="createGameSub">Select your options.</div>
            <div className="gamePrivacySelection">
                <div onClick={()=>setGamePrivacyChoice("private")} className={`privateBut ${gamePrivacyChoice == "private"&& "selectedBut" }`}>Private</div>
                <div onClick={()=>setGamePrivacyChoice("public")} className={`publicBut ${gamePrivacyChoice == "public"&& "selectedBut" }`}>Public</div>
            </div>
            <DropdownButton id="dropdown-player" title={`${playerCount} Players`}>
                <Dropdown.Item onClick={()=>setPlayerCount(4)}>4 Players</Dropdown.Item>
                <Dropdown.Item onClick={()=>setPlayerCount(6)}>6 Players</Dropdown.Item>
                <Dropdown.Item onClick={()=>setPlayerCount(8)}>8 Players</Dropdown.Item>
            </DropdownButton>
            <div onClick={()=>handleSocketCreateGame({maxPlayer:playerCount,roomPrivacy:gamePrivacyChoice,userData:userData})} className="createGameButton">Create Game</div>
        </div>
      </Modal>
    )
    
}
export default CreateGameModal

//
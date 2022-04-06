const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
var cors = require('cors')  //use this
const { v4 } = require('uuid');
const chalk=require("chalk");

const app = express();
app.use(express.json());
const server = http.createServer(app)
const PORT = 3000 || process.env.PORT
const io = socketio(server,{
    cors:{
        origin:"http://10.0.0.42:3001"
        // origin:"http://localhost:3001"
    }
})

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")))
app.use(cors()) //and this




//Socket Variables
//All clinets, Object => {id:String,loggedIn:Bool,name:String}
const allClients = {}
const sessionToSocket = {} //link sessionId:ClientId
//Contains all rooms => roomId : {id:String,adminId:String,players:Arr,Status:Int,}  STATUS 1=waiting lobby 2=Started
const allRooms = {}


const filterPublicRooms = ()=>{
    allRoomKeys = Object.keys(allRooms);
    let finalRoomList = []
    for(let i=0;i<allRoomKeys.length;i++){
        if(allRooms[allRoomKeys[i]].roomPrivacy == "public"){
            finalRoomList.push(allRooms[allRoomKeys[i]])
        }
    }
    return finalRoomList
}


//Runs when client connects
io.on('connection',(socket)=>{
    console.log(`New websocket connection... ${socket.id}`)
        
    socket.emit("askCredentials")
    
    //This is used to accept when a user sends their information, then sends a confirmation message
    socket.on("credentialReceive",credentials=>{
        console.log("\n"+chalk.black.bgYellow.bold(`Credentials Received:`),credentials)
        //If session id is already here (refresh), change that user everywhere
        if(allClients[credentials.sessionId]){
            //already in system
            console.log(`${allClients[credentials.sessionId].username} has reconnected`)
            socket.emit("updateNameFromServer",allClients[credentials.sessionId].username)
        }else{
            const d =Date.now()
            const newUsername = `Guest_${d}`
            allClients[credentials.sessionId]= {sessionId:credentials.sessionId,loggedIn:false,username:newUsername,imageNum:credentials.imageNum,roomHosting:""};
            socket.emit("updateNameFromServer",newUsername)
            console.log(`\n${chalk.bgGreen.bold("New connection ")}${chalk.bgBlue.bold(`SessionId: ${credentials.sessionId}`)} ${chalk.bgWhite.bold(`Username: ${newUsername}`)}`)
        }
        sessionToSocket[credentials.sessionId] = socket
        socket.emit("message","Credentials were received successfully")
        io.emit("sendOnlinePlayers",allClients)
    })
    
    socket.on("playerLeave", (info)=>{
        if(!allRooms[info.lastRoom]){
            return
        }

        for(let i=0;i<allRooms[info.lastRoom].players.length;i++){

            if(allRooms[info.lastRoom].players[i] === info.sessionId){
                allRooms[info.lastRoom].players.splice(i, 1); //remove from players list
                
                //remove from teamList
                let foundPlayer = false
                for(let l=0;l < allRooms[info.lastRoom].teams.left.players.length;l++){ //left
                    if(allRooms[info.lastRoom].teams.left.players[l] == info.sessionId){
                        allRooms[info.lastRoom].teams.left.players.splice(l, 1); //remove
                        //Check if leader of left
                        if(allRooms[info.lastRoom].teams.left.leader == info.sessionId){
                            if(allRooms[info.lastRoom].teams.left.players[0]){
                                allRooms[info.lastRoom].teams.left.leader = allRooms[info.lastRoom].teams.left.players[0]
                            }else{
                                allRooms[info.lastRoom].teams.left.leader = null
                            }
                        }
                        foundPlayer = true
                        break;
                    }
                } 

                if(!foundPlayer){
                    for(let l=0;l < allRooms[info.lastRoom].teams.right.players.length;l++){ //Right
                        if(allRooms[info.lastRoom].teams.right.players[l] == info.sessionId){
                            allRooms[info.lastRoom].teams.right.players.splice(l, 1); //remove
                            //Check if leader of right
                            if(allRooms[info.lastRoom].teams.right.leader == info.sessionId){
                                if(allRooms[info.lastRoom].teams.right.players[0]){
                                    allRooms[info.lastRoom].teams.right.leader = allRooms[info.lastRoom].teams.right.players[0]
                                }else{
                                    allRooms[info.lastRoom].teams.right.leader = null
                                }
                            }
                            break;
                        }
                    } 
                }

                console.log('checking if admin')
                console.log("room admin:",allRooms[info.lastRoom].adminId)
                if( allRooms[info.lastRoom].adminId == info.sessionId ){    
                    //kick em and redirect
                    for(let i=0;i<allRooms[info.lastRoom].players.length;i++){
                        sessionToSocket[allRooms[info.lastRoom].players[i]].emit("redirectToHome",{})
                    }
                    delete allRooms[info.lastRoom]
                    console.log("admin left and we deleted room")
                    break;
                }else{
                    //just let them know one plaayer left
                    console.log("player left")
                    for(let i=0;i<allRooms[info.lastRoom].players.length;i++){
                        sessionToSocket[allRooms[info.lastRoom].players[i]].emit("sendRoomInfo",{roomInfo:allRooms[info.lastRoom]})
                    }
                }
                break;
            }
        }


        io.emit('sendPublicRooms',filterPublicRooms())
        io.emit('updateRoom',allRooms )
    })


    //This is used to create a room and send the room information to the user that requested(admin)
    socket.on('createRoom',({maxPlayer,roomPrivacy,userData,sessionId})=>{
        const roomId = v4()
        
        const roomObj = {
            id:roomId,
            adminId:sessionId,
            adminName:userData.username,
            players:[sessionId],
            maxPlayer:maxPlayer,
            roomPrivacy:roomPrivacy,
            teams:{left:{leader:null,players:[]},right:{leader:null,players:[]},host:sessionId},
            status:1,
            round:0
        }
        allRooms[roomId] = roomObj

        if(allClients[sessionId]){
            allClients[sessionId].roomHosting = roomId
        }

        socket.emit("roomCreated",roomObj)

        io.emit("sendPublicRooms",filterPublicRooms())
    })

    socket.on("updateName",({newName,sessionId})=>{

        if(allClients[sessionId]){
            console.log(`Id: ${sessionId} just updated name from ${allClients[sessionId].username} to ${newName}`)
            allClients[sessionId].username =newName
            io.emit('sendOnlinePlayers', allClients)
        }else{
            return
        }

        if(allRooms[allClients[sessionId].roomHosting]){
            allRooms[allClients[sessionId].roomHosting].adminName = newName
            console.log(`Id: ${sessionId} just updated room adminName`)
            io.emit('sendPublicRooms',filterPublicRooms())
        }
        
    })

    socket.on("updateRoomInfo",({roomId})=>{
        if(allRooms[roomId]){
            const roomInfo = allRooms[roomId]
            socket.emit("sendRoomInfo",{roomInfo})
        }
    })

    socket.on("joinRoom",({sessionId,roomId})=>{
        let foundRoom = allRooms[roomId]
        if(!foundRoom){
            return
        }else{
            //check if full
            if(foundRoom.players.length<foundRoom.maxPlayer){
                //succeed join
                allRooms[roomId].players.push(sessionId)

                //add to one team
                if(allRooms[roomId].teams.left.players.length > allRooms[roomId].teams.right.players.length){
                    allRooms[roomId].teams.right.players.push(sessionId)
                    //if empty make leader
                    if(allRooms[roomId].teams.right.players.length==1){
                        allRooms[roomId].teams.right.leader = sessionId
                    }
                }else{
                    allRooms[roomId].teams.left.players.push(sessionId)
                    //if empty make leader
                    if(allRooms[roomId].teams.left.players.length==1){
                        allRooms[roomId].teams.left.leader = sessionId
                    }
                }

                socket.emit("redirectToRoom",{roomId})
                
                //tell everyone in the room (before pushign new)
                const roomInfo = allRooms[roomId]
                for(let i=0;i<foundRoom.players.length;i++){
                    sessionToSocket[foundRoom.players[i]].emit("sendRoomInfo",{roomInfo})
                }

                //tell others 
                io.emit('sendPublicRooms',filterPublicRooms())

            }else{
                console.log("room full")
            }
        }
    })

    socket.on("startGame",({roomId,sessionId})=>{
        //find room
        let foundRoom = allRooms[roomId]
        if(foundRoom){
            //if admin
            if(foundRoom.adminId == sessionId){
                allRooms[roomId].status = 2
                // tell everyone in room
                for(let i=0;i<foundRoom.players.length;i++){
                    if(sessionToSocket[foundRoom.players[i]]){
                        sessionToSocket[foundRoom.players[i]].emit("sendRoomInfo",{roomInfo:allRooms[roomId]})
                    }
                }
            }
        }
    })
    //Send All online  
    io.emit('sendOnlinePlayers', allClients)

    //Send Public rooms on connect
    io.emit('sendPublicRooms',filterPublicRooms())

     //Listens
    socket.on("disconnect",()=>{
        io.emit("message","A user has left the chat")
        
        socket.broadcast.emit('sendOnlinePlayers', allClients)
    })
})




server.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`)
});




// const printroom = ()=>{
//     console.log(allRooms    )
// }
// var intervalID = setInterval(printroom,10000);

const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")

const app = express();
const server = http.createServer(app)
const PORT = 3000 || process.env.PORT
const io = socketio(server)


// Set Static Folder
app.use(express.static(path.join(__dirname, "public")))

//Runs when client connects
io.on('connection',(socket)=>{
    console.log(`New websocket connection...`)

    socket.on("disconnect",()=>{
        io.emit("message","A user has left the chat")
    })
})


server.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`)
});
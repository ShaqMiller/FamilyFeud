// client/Socket.js
import socketIOClient from "socket.io-client";
const ENDPOINT = 'http://10.0.0.42:3000';
// const ENDPOINT = 'http://localhost:3000';

export default socketIOClient(ENDPOINT);
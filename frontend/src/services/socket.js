import { io } from "socket.io-client";
const SOCKET = "http://localhost:5000";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");
    socket = io(SOCKET, {
      auth: { token },
    });
  }
  return socket;
};

export const disconnectSocket = () => {
    if(socket){
        socket.disconnect();
        socket = null
    }
}
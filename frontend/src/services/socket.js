import { io } from "socket.io-client";
import { API_ORIGIN } from "../config/api";

const SOCKET = API_ORIGIN;

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

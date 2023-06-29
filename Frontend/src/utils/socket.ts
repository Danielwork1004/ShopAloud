import { io } from "socket.io-client"

if(!import.meta.env.VITE_API_URL){
  throw new Error("API_URL is not defined")
}

export const socket = io(import.meta.env.VITE_API_URL)
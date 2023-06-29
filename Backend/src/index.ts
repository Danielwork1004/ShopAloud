import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import db from '../db'
import { onConnection } from './utils/socketio'
import dotenv from "dotenv"

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN
  }
})

io.on('connection', onConnection)

server.listen(4001, () => {
  console.log('Server ready 🚀 ')
})

app.get("/sessions", async(req, res) => {
  const sessions = await db.session.findMany({
    select: {
      id: true,
      audioPaths: true,
      events: true,
      userId: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  res.send({ sessions })
})

app.get("/users", async(req, res) => {
  const users = await db.user.findMany({
    include: {  
      sessions: true
    }
   });

   const mappedUsers = users.map(user => {
    const { sessions, ...rest } = user
     return {
       ...rest,
       numSessions: sessions.length
     }
    });

  res.send({ users: mappedUsers })
})

app.get("/sessions/:id", async(req, res) => {
  const { id } = req.params
  const session = await db.session.findUnique({
    where: {
      id
    }
  })

  res.send({ session })
})
import { saveData } from '../utils/saveData';
import { runPuppeteer } from './runPuppeteer';
import { socketByUser, dataChunks } from './tempDataStore';

const pushAudioChunk = ({ username, data }: any) => {
  if (!dataChunks[username]) {
    dataChunks[username] = {}
  }

  const connectionCount = dataChunks[username].connectionCount || 0

  if (!dataChunks[username].recording) {
    dataChunks[username].recording = []
  }

  if (!dataChunks[username].recording[connectionCount]) {
    dataChunks[username].recording[connectionCount] = [data]
  } else {
    dataChunks[username].recording[connectionCount].push(data)
  }
}

/*
* stores data buffer temporary
*/
const pushEventChunk = ({ username, data }: any) => {
  if (!dataChunks[username]) {
    dataChunks[username] = {}
  }

  const connectionCount = dataChunks[username].connectionCount || 0

  if (!dataChunks[username].events) {
    dataChunks[username].events = []
  }

  if (!dataChunks[username].events[connectionCount]) {
    dataChunks[username].events[connectionCount] = [data]
  } else {
    dataChunks[username].events[connectionCount].push(data)
  }
}

const pushDataChunk = ({ username, data, key, includeTimeStamp = true }: any) => {
  const dataWithTimestamp = {
    data,
    timestamp: Date.now()
  }

  const dataToPush = includeTimeStamp ? dataWithTimestamp : data

  if (!dataChunks[username]) {
    dataChunks[username] = {}
  }

  if (!dataChunks[username][key]) {
    dataChunks[username][key] = [dataToPush]
  } else {
    dataChunks[username][key].push(dataToPush)
  }
}

export const onConnection = (socket: any) => {
  socket.on('user:connected', (username: string) => {
    console.log(`*** User ${username} connected`)
    socketByUser[username] = socket
    if (!socketByUser[username]) {
      console.log('*** user connected for the first time')
    } else if (dataChunks[username]) {
      console.log('*** user reconnected')
      dataChunks[username].connectionCount = dataChunks[username].connectionCount ? dataChunks[username].connectionCount + 1 : 1
    }
  })

  socket.on('recording:start', ({ data, username }: { data:any, username: any }) => {
    console.log(`*** User ${username} started recording`)
    pushAudioChunk({ username, data })
  })
  socket.on('videoStream:start', ({ data, username }: any ) => {
    console.log(`*** User ${username} started streaming events`)
    pushEventChunk({ username, data })
  })

  socket.on('recording:end', (username: string) => {
    console.log(`*** User ${username} stopped recording`)
    const userData = dataChunks[username]
    if (userData && Object.keys(userData).length) {
      saveData(userData, username).then((audioUrls) => {
        console.log('*** data saved')
        dataChunks[username] = {}

        const userSocket = socketByUser[username]

        if (userSocket) {
          console.log('*** emitting audio:saved', { audioUrls })
          userSocket.emit('audio:saved', { audioUrls })
        }
      })
      runPuppeteer(userData, username)
    }
  })

  socket.on('dom:mutation', ({ data, username }: any) => {
    console.log(`*** User ${username} dom mutation`)
    pushDataChunk({ username, data, key: 'domMutations' })
  })

  socket.on('mouse:position', ({ data, username }: any) => {
    console.log(`*** User ${username} mouse position`)
    pushDataChunk({ username, data, key: 'mousePositions' })
  })

  socket.on('scroll:position', ({ data, username }: any) => {
    console.log(`*** User ${username} scroll position`)
    pushDataChunk({ username, data, key: 'scrollPositions' })
  })

  socket.on('click:event', ({ data, username }: any) => {
    console.log(`*** User ${username} click event`)
    pushDataChunk({ username, data, key: 'clickEvents' })
  })


  socket.on('disconnect', () => {
    // console.log(`*** User ${socketByUser[socket.id]} disconnected`)
    const username = socketByUser[socket.id]
    if (dataChunks[username] && Object.keys(dataChunks[username]).length) {
      // possibly mark to optionally save after X minutes of inactivity
      //console.log(`*** User ${username} disconnected while recording`)
    }
  })
}
import { useRef } from "preact/hooks"
import { stringify_object } from "../utils";
import { socket } from "../utils/socket";
import { useCurrentSession } from "./useCurrentSession"
import { useMediaRecorder } from "./useMediaRecorder";

let dataChunks: any[] = []

export const useSocket = () => {
  const [sessionData] = useCurrentSession()
  const { getUserMedia, setMedia, voiceStream, mediaRecorder } = useMediaRecorder()

  const socketRef = useRef(socket)

  const connectSocket = () => socketRef.current.emit('user:connected', sessionData.id)

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder?.state === "recording") {
      //console.log({ mediaRecorder })
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())

    }

    socketRef.current.emit('recording:end', sessionData.id)

    //console.log("stop recording", mediaRecorder)

    // socketRef.current.disconnect()

    //console.log("stop")
    setMedia({
      voiceStream: null,
      mediaRecorder: null,
    })

    dataChunks = []
  }

  const startRecording = async () => {
    //console.log({ mediaRecorder, voiceStream })
    const res = await getUserMedia()
    if (res) {
      const { voiceStream: _voiceStream, mediaRecorder: _mediaRecorder } = res
      _mediaRecorder.ondataavailable = ({ data }: any) => {
        dataChunks.push(data)
        //console.log('*** dataChunks', dataChunks.length)
        socketRef.current.emit('recording:start', {
          username: sessionData.id,
          data
        })
      }
      _mediaRecorder.start(250)
      setMedia({
        voiceStream: _voiceStream,
        mediaRecorder: _mediaRecorder,
      })
    }
  }

  const transmitEvent = async (events: any) => {
    socketRef.current.emit('videoStream:start', {
      username: sessionData.id,
      data: {
        events,
        url: window.location.href
      }
    })
  }

  return {
    getUserMedia,
    connectSocket,
    startRecording,
    stopRecording,
    transmitEvent,
    sendData: ({ key, data }: { key: string, data: any }) => {
      //console.log('*** sendData', key, data)
     // console.log({ socketRef: socketRef.current })
      const stringifiedData = stringify_object(data)
      //console.log({ stringifiedData })
      socketRef.current.emit(key, { data: stringifiedData, username: sessionData.id })
    }
  }
}
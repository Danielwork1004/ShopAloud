import { useEffect } from "preact/hooks";
import { useSessionMachine } from "../../hooks/useSessionMachine";
import { useSocket } from "../../hooks/useSocket"

export const GettingStarted = () => {
  const { getUserMedia } = useSocket();
  const [_, sendEvent] = useSessionMachine();

  useEffect(() => {
    getUserMedia()
      .then(res => {
        if(res) {
          sendEvent("GET_SCREEN_STREAM_SUCCESS")
        } else {
          sendEvent("GET_SCREEN_STREAM_FAILURE")
        }
      })
  }, [])
  
  return <div className="flex flex-col items-center justify-center text-center space-y-4">
    <p className="text-grey-500 text-xs">Permissions</p>

    <p className="text-lg">
      <span className="font-bold">Click <button onClick={async() => {
        const res = await getUserMedia()
        if (res) {
          sendEvent("GET_SCREEN_STREAM_SUCCESS")
        }else {
          sendEvent("GET_SCREEN_STREAM_FAILURE")
        }
      }}>"Allow"</button> </span>
      on the other prompt to give ShopAloud permission to access your microphone.
    </p>

    <p>(So you can provide verbal commentary as you use this site)</p>
  </div>
}
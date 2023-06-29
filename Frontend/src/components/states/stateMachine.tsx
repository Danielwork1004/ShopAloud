import { useSessionMachine } from "../../hooks/useSessionMachine"
import { GettingScreenStream } from "./gettingScreenStream"
import { GettingStarted } from "./gettingStarted"
import { Idle } from "./idle"
import { Recording } from "./recording"
import { ShowRecording } from "./showRecording"
import { Success } from "./success"

export const StateMachine = () => {
  const [currentState] = useSessionMachine()
  console.log({ currentState })
  
  switch(currentState) {
    case "idle":
      return <Idle />
    case "gettingStarted":
      return <GettingStarted />
    case "gettingScreenStream":
      return <GettingScreenStream />
    case "showRecording":
      return <ShowRecording />
    case "recording":
      return <Recording />
    case "success":
      return <Success />
    default:
      return null
  }
}
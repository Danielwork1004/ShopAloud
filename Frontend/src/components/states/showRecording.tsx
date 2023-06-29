import { useSessionMachine } from "../../hooks/useSessionMachine"
import { useSocket } from "../../hooks/useSocket";
import { PrimaryButton } from "../primaryButton"

export const ShowRecording = () => {
  const [_, sendEvent] = useSessionMachine();

  return <div className="flex flex-col items-center justify-center text-center">
    <p className="text-lg font-bold">Click below to start recording your thoughts!</p>

    <PrimaryButton onClick={() => {
      sendEvent("START_RECORDING")
    }}>Start recording</PrimaryButton>
  </div>
}
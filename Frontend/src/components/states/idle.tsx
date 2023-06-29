import { useSessionMachine } from "../../hooks/useSessionMachine"
import { PrimaryButton } from "../primaryButton"

export const Idle = () => {
  const [_, sendEvent] = useSessionMachine()
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 p-4">
      <p className="text-lg font-bold">Think aloud using this site!</p>

      <p className="text-sm">Use this window to anonymously record your verbal comments while you're here</p>

      <p className="text-sm">By clicking "Get Started" below, you agree to the <a>Terms of Service</a></p>

      <div className="flex space-x-4">
        <PrimaryButton onClick={() => { sendEvent("GET_STARTED") }}>
          Get Started
        </PrimaryButton>
      </div>
    </div>
  )
}
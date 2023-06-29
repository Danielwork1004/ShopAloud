import { useSessionMachine } from "../../hooks/useSessionMachine";
import { PrimaryButton } from "../primaryButton"

export const Success = () => {
  const [_, sendEvent] = useSessionMachine();
  return (
    <div>
      <p>
        Thank you for your feedback!
      </p>

      <PrimaryButton onClick={() => sendEvent("SHOW_RECORDING")}>
        Start again
      </PrimaryButton>
    </div>
  )
}
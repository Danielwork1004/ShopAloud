import { useCurrentSession } from "./useCurrentSession";
import { useSessionMachine } from "./useSessionMachine";

export const useSessionControls = () => {
  const [sessionData, setSessionData] = useCurrentSession();
  const [currentState, sendEvent] = useSessionMachine();

  const startSession = () => {
    setSessionData({ ...sessionData, status: "recording" });
  };

  const stopSession = () => {
    setSessionData({ ...sessionData, status: "stopped" });
  };

  return {
    status: sessionData.status,
    startSession,
    stopSession,
  }
}
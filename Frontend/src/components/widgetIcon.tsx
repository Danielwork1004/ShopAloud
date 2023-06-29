import { useCurrentSession } from "../hooks/useCurrentSession"
import { useSessionMachine } from "../hooks/useSessionMachine"
import { RecordingIcon } from "./recordingIcon"

export const WidgetIcon = ({setIsOpen}: { setIsOpen: (val: any) => void}) => {
  const [currentState] = useSessionMachine()
  const [{id}] = useCurrentSession()

  return (
    <div className="self-end relative cursor-pointer">
      {currentState === "recording" && <RecordingIcon />}
      <div onClick={() => setIsOpen((isOpen: boolean) => !isOpen)} className={`flex flex-col items-center justify-center w-32 h-32 opacity-70 bg-gray-200 p-4 rounded-md space-y-2`}>
          <span className='text-lg text-blue-500 font-semibold'>Shop<span className="text-orange-500">Aloud</span></span>
          <p className="text-xs text-center">{id}</p>
      </div>
    </div>
  )
}
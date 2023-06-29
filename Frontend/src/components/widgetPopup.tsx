import { StateMachine } from "./states/stateMachine"

// popup with a tail that appears on click of the widget
export const WidgetPopup = ({open, setIsOpen}: {open: boolean, setIsOpen: (value: boolean) => void}) => {
  const transitionStyles = `transition duration-150 ease-in-out`
  const popupStyles = `flex flex-col left-0 z-10 w-96 h-96 bg-white rounded-md shadow-lg mb-4 ${transitionStyles}`
  return (
    <div className={`${popupStyles} tooltip w-64 h-84 opacity-70 bg-gray-200 p-4 rounded-md space-y-2 ${open ? '': 'hidden'}`}>
      <button className="self-end" onClick={() => setIsOpen(false)}>X</button>
      <div className="flex flex-col items-center justify-between h-full">
        <StateMachine />
        <span className='text-sm self-start text-blue-500 font-semibold'>Shop<span className="text-orange-500">Aloud</span></span>
      </div>
    </div>
  )
}
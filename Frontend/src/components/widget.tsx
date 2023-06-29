import { useWidgetOpen } from "../hooks/useWidgetOpen"
import { WidgetIcon } from "./widgetIcon"
import { WidgetPopup } from "./widgetPopup"

export const Widget = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useWidgetOpen()
  return (
    <div className='flex flex-col'>
      <WidgetPopup open={isWidgetOpen} setIsOpen={setIsWidgetOpen} />
      <WidgetIcon setIsOpen={setIsWidgetOpen} />
    </div>
  )
}
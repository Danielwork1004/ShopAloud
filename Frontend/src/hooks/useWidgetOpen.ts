import { atomWithStorage } from 'jotai/utils'
import { useAtom } from "jotai"

export const widgetOpenAton = atomWithStorage('shopaloud_widgetIsOpen', false)

export const useWidgetOpen = () => {
  return useAtom(widgetOpenAton)
}
import { useEffect } from "preact/hooks"
import debounce from "lodash.debounce"

interface Props {
  enabled?: boolean;
  onMouseData: (data: { x: number; y: number }) => void;
  onScrollData: (data: { scrollX: number; scrollY: number }) => void;
  interval?: number
}

export const useMouseAndScrollPosition = ({ 
  enabled = true, 
  onMouseData,
  onScrollData, 
  interval = 100
}: Props) => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseData = { x: e.clientX, y: e.clientY }
      onMouseData(mouseData)
    }

    const handleScroll = (e: Event) => {
      const scrollData = { scrollX: window.scrollX, scrollY: window.scrollY }
      onScrollData(scrollData)
    }

    const debouncedHandleMouseMove = debounce(handleMouseMove, interval)
    const debouncedHandleScroll = debounce(handleScroll, interval)

    if (enabled) {
      document.addEventListener("mousemove", debouncedHandleMouseMove)
      document.addEventListener("scroll", debouncedHandleScroll)
    }

    return () => {
      document.removeEventListener("mousemove", debouncedHandleMouseMove)
      document.removeEventListener("scroll", debouncedHandleScroll)
    }
  }, [enabled])
} 
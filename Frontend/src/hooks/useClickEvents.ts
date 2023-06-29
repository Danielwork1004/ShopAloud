import { useCallback, useEffect } from "preact/hooks"

interface Props {
  enabled?: boolean;
  onClick: (e: MouseEvent) => void;
}

export const useClickEvents = ({ onClick, enabled = true }: Props) => {
  const handleClick = (e: MouseEvent) => {
   // console.log("click clicks")
    if (enabled) {
      onClick(e)
    }
  }
  
  useEffect(() => {
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  });
}
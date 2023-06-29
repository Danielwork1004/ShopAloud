import { uuid4 } from "../utils"
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from "jotai"

const defaultData = {
  id: uuid4(),
  status: "stopped"
}

export const sessionDataAtom = atomWithStorage('shopaloud_currentSession', defaultData, {
  // custom local storage setup needed as default does not commit initial value to local storage
  getItem: (key) => {
    const item = localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    }else {
      const newData = defaultData
      localStorage.setItem(key, JSON.stringify(newData))
      return newData
    }
  },
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: (key) => {
    localStorage.removeItem(key)
  }
})

export const useCurrentSession = () => {
  return useAtom(sessionDataAtom)
}
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils"
import { useState } from "preact/hooks"

const mediaAtom = atom<{
  voiceStream: MediaStream | null,
  mediaRecorder: MediaRecorder | null,
}>({
  voiceStream: null,
  mediaRecorder: null,
});

export const useMediaRecorder = () => {
  const [{ voiceStream, mediaRecorder }, setMedia] = useAtom(mediaAtom)

  const getUserMedia = async () => {
    let _voiceStream: any
    if (navigator.mediaDevices.getUserMedia) {
      try {
        _voiceStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })

        console.log(_voiceStream)
        //
        const _mediaRecorder = new MediaRecorder(_voiceStream)

        setMedia({
          voiceStream: _voiceStream,
          mediaRecorder: _mediaRecorder,
        })
        return {
          voiceStream: _voiceStream,
          mediaRecorder: _mediaRecorder,
        }
      } catch (e) {
        console.error('*** getDisplayMedia', e)
      }
    } else {
      console.warn('*** getDisplayMedia not supported')
    }
    return false
  }


  return {
    getUserMedia,
    mediaRecorder,
    voiceStream,
    setMedia,
  }
}

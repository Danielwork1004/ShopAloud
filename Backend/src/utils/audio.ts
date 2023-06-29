import { v4 as uuid4 } from 'uuid';
import { Blob, Buffer } from 'buffer';

export const getBufferFromAudioData = async(audioData: any) => {
  const audioBlob = new Blob(audioData, {
    type: 'audio/webm'
  })

  const audioBuffer = Buffer.from(await audioBlob.arrayBuffer())
  return {
    fileBuffer: audioBuffer,
    fileName: uuid4() + '.webm'
  }
}
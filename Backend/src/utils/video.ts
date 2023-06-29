import { v4 as uuid4 } from 'uuid';
import { Blob, Buffer } from 'buffer';

export const getBufferFromVideoData = async(videoData: any) => {
  const videoBlob = new Blob(videoData, {
    type: 'video/webm'
  })

  const videoBuffer = Buffer.from(await videoBlob.arrayBuffer())
  return {
    fileBuffer: videoBuffer,
    fileName: uuid4() +"vid"+ '.webm'
  }
}
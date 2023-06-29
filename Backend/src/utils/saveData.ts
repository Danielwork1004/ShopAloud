import db from '../../db'

import { uploadToS3 } from './s3'
import { getBufferFromAudioData } from './audio'
import { getBufferFromVideoData } from './video'

export const saveData = async (data: any, username: string) => {

  const { recording, events, ...eventData } = data

  try {
    /*const videoFilePaths = await Promise.all(stream.filter((data: any) => data?.length).map(async (videoData: any) => {
      const { fileBuffer, fileName } = await getBufferFromVideoData(videoData)
      console.log({fileBuffer,fileName})
      const { filePath } = await uploadToS3({ fileBuffer, fileName })
      return filePath
    }));*/
    const filePaths = await Promise.all(recording.filter((data: any) => data?.length).map(async (audioData: any) => {
      const { fileBuffer, fileName } = await getBufferFromAudioData(audioData)
      const { filePath } = await uploadToS3({ fileBuffer, fileName })
      return filePath
    }))
    
    if (!filePaths?.length) {
      throw new Error("Filepaths not set")
    }

    const existingUser = await db.user.findUnique({
      where: {
        id: username
      }
    });

    let user = existingUser

    if (!existingUser) {
      user = await db.user.create({
        data: {
          id: username
        }
      })
    }

    await db.session.create({
      data: {
        user: {
          connect: {
            id: user!.id
          }
        },
        audioPaths: filePaths!,
       // videoPaths: videoFilePaths!,
        events: eventData,
      }
    })
    console.log('*** Saved paths', filePaths)
    return filePaths

  } catch (e) {
    console.log('*** saveData', e)
  }
}
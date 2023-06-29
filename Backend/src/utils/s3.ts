import AWS from "aws-sdk"
import { Buffer } from 'buffer';
import dotenv from "dotenv"

dotenv.config()

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  
})
console.log("Aws Bucket ..");
console.log(s3.endpoint?.host);
interface Props {
  fileBuffer: Buffer | AudioBuffer
  fileName: string
}

export const uploadToS3 = async({ fileBuffer, fileName}: Props) => {
  console.log("uploading to s3");
  if(!process.env.S3_BUCKET) {
    throw new Error("S3_BUCKET not set")
  }

  const params = {
    Key: fileName,
    Body: fileBuffer,
    Bucket: process.env.S3_BUCKET,
  }
  console.log(params)
  let put = s3.upload(params)

  try {
    const response = await put.promise()
    console.log("Successfully uploaded", response);

    return {
      filePath: response.Location,
      result: true,
    }
  } catch (e) {
    console.error(e)
    return {
      result: false,
      error: e
    }
  }
}


export default s3
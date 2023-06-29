import * as fs from "fs";
import path from "path";
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
import ffmpeg from "fluent-ffmpeg";
import { uploadToS3 } from "./s3";
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
//@ts-ignore
import videoshow from "videoshow";

export const saveAsVideo = async (
  videoPath: any,
  screenshotPath: string,
  username: string
) => {
  try {
    const screenShots = fs.readdirSync(screenshotPath);
    const durations = [];
    if (Array.isArray(screenShots) && screenShots.length > 0) {
      screenShots.sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      );
      let prevTimestamp;
      let photosPath = [];
      for (const screenshot of screenShots) {
        const currentTimestamp = parseInt(screenshot.split(".")[0]);
        if (prevTimestamp) {
          const duration = (currentTimestamp - prevTimestamp) / 1000;
          durations.push(duration);
          photosPath.push({
            path: path.join(screenshotPath, screenshot),
            loop: duration < 0.1 ? 0.1 : duration,
          });
        }

        prevTimestamp = currentTimestamp;
      }
      var videoOptions = {
        fps: 25,
        // loop: 0.5, // seconds
        transition: false,
        // transitionDuration: 0.1, // sesconds
        videoBitrate: 1024,
        videoCodec: "libx264",
        audioBitrate: "128k",
        audioChannels: 2,
        format: "mp4",
        pixelFormat: "yuv420p",
        size: "1920x?",
      };
      console.log(`${photosPath.length} photos loaded`);
      videoshow(photosPath, videoOptions)
        .save(videoPath)
        .on("end", async function () {
          for (const screenshot of screenShots) {
            fs.unlinkSync(path.join(screenshotPath, screenshot));
          }
          console.log("Processing finished !");
          const videoBuffer = fs.readFileSync(videoPath);
          if (videoBuffer) {
            const path = await uploadToS3({
              fileBuffer: videoBuffer,
              fileName: `${username}.mp4`,
            });
            // fs.unlinkSync(videoPath);
          }
          console.log("Video uploaded!");
        });
    }
  } catch (error) {
    console.error(error);
  }
};

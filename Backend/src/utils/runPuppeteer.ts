import path from "path";
import fs = require("fs");
import puppeteer, { Page } from "puppeteer";
import Ffmpeg = require("fluent-ffmpeg");
import { mouseCursor } from "./mouseCursor";
import { saveAsVideo } from "./saveAsVideo";
import Jimp = require("jimp");
import { IEvent, IEvents } from "../types";
import { handleEvents } from "./handleEvents";

export const runPuppeteer = async (data: any, username: string) => {
  try {
    const {
      events,
    }: {
      events: IEvents;
    } = data;

    let prevUrl = null;
    let browser = null;
    let page: Page | null = null;
    let photoPath: string | null = null;
    let chainOfEvents: IEvent[] = [];
    let chainOfMutations: any[] = [];
    let formData: { [id: string]: string } | {} = {};
    const tempStorage = path.join(__dirname, `temp/${username}/photos`);
    const videoStorage = path.join(__dirname, `temp/${username}/videos`);
    const videoPath = path.join(
      __dirname,
      `temp/${username}/videos/${username}.mp4`
    );
    if (!fs.existsSync(tempStorage)) {
      fs.mkdirSync(tempStorage, { recursive: true });
    } else {
      fs.readdir(tempStorage, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          console.log(file + " : File Deleted Successfully.");
          fs.unlinkSync(`${tempStorage}/${file}`);
        }
      });
    }
    if (!fs.existsSync(videoStorage)) {
      fs.mkdirSync(videoStorage, { recursive: true });
    } else {
      fs.readdir(videoStorage, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          console.log(file + " : File Deleted Successfully.");
          fs.unlinkSync(`${videoStorage}/${file}`);
        }
      });
    }
    if (events?.length > 0 && Array.isArray(events[0]))
      for (const event of events[0]) {
        console.log("Reproducing Events");
        let url = event.url;
        if (prevUrl !== url) {
          prevUrl = url;
          console.log("URL NOT SAME");
          browser = await puppeteer.launch({
            headless: true,
            args: [
              "--disable-web-security",
              "--blink-settings=imagesEnabled=true",
            ],
          });
          page = await browser.newPage();
          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36');
          chainOfEvents = [];
          chainOfMutations = [];
        }
        if (page) {
          const isPageUp = await page.evaluate(
            () => document.readyState === "complete"
          );
          if (isPageUp) {
            await page.goto(url, { waitUntil: "networkidle0" });

            const eventType = event.events.type;
            await page.setViewport({ width: 1920, height: 1080 });
            await mouseCursor(page);
            const time = await handleEvents(
              eventType,
              page,
              event,
              chainOfEvents,
              chainOfMutations,
              formData
            );
            if (time) {
              console.log("Loading");
              const photo = await page.screenshot({
                type: "png",
              });
              photoPath = path.join(tempStorage, `${time}.png`);
              const resizeImage = await Jimp.read(photo);
              resizeImage.resize(2560, 1440).quality(100);
              await resizeImage.writeAsync(photoPath);
            }
          }
        }
      }
    await browser?.close();

    await saveAsVideo(videoPath, tempStorage, username);
  } catch (error) {
    console.error(error);
  }
};

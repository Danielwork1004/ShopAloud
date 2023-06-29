import { KeyInput, Page } from "puppeteer";
import { KEYS } from "../../constants/keys";
import { EVENT_TYPES, IEvent } from "../types";
import { handleMutation } from "./handleMutation";
import { safelyParse } from "./safelyParse";

export async function handleEvents(
  eventType: EVENT_TYPES,
  page: Page,
  event: IEvent,
  chainOfEvents: IEvent[],
  chainOfMutations: any[],
  formData: { [id: string]: string } | any
) {
  const promises = [];

  if (chainOfEvents.length > 0) {
    if (chainOfEvents.map((e) => e.events.type).includes(eventType)) {
      const index = chainOfEvents.map((e) => e.events.type).indexOf(eventType);
      chainOfEvents.splice(index, 1);
    }
    chainOfEvents.push(event);
  } else {
    chainOfEvents.push(event);
  }
  const previousEvents = chainOfEvents.map((e) => e.events.type);
  if (eventType === "initialState" || previousEvents.includes("initialState")) {
    const index = previousEvents.indexOf("initialState");
    const initialHtml = event.events.html || chainOfEvents[index].events.html;
    promises.push(page.setContent(safelyParse(initialHtml)));
    promises.push(
      page.evaluate((initialScrollPosition) => {
        window.scrollTo(0, initialScrollPosition);
      }, event.events.initialScrollPosition)
    );
    for (const input of Object.keys(formData)) {
      const element = input ? await page.$(`#${input}`) : null;
      const value = formData[input].replace(/\\\\b/g, "\\b");
      console.log(value);
      if (element) await element?.type(value);
    }
  }
  if (eventType === "initialState") {
    const form = event.events.formData;
    if (Object.keys(formData).length < 1) {
      Object.assign(formData, form);
    }
    console.log("Init");
  }
  if (eventType === "focus") {
    const focusElement = safelyParse(event.events.focusElement);
    if (focusElement) promises.push(page.focus(`#${focusElement}`));
  }
  if (eventType === "keydown" && previousEvents.includes("focus")) {
    const key = getKeyCode(event.events.keyCode);
    console.log(key);
    const index = previousEvents.indexOf("focus");
    const focusElement = safelyParse(
      chainOfEvents[index].events.focusElement
    ) as string;
    if (focusElement) {
      if (focusElement in formData) {
        Object.assign(formData, {
          [focusElement]: formData[focusElement] + key,
        });
      } else {
        Object.assign(formData, {
          [focusElement]: key,
        });
      }

      //   Object.keys(formData).forEach(async (input)=>{
      //     const element = await page.$(`#${input}`)
      //     await element?.type(formData[input])
      //   })

      //   promises.push(page.focus(`#${focusElement}`));
      //const input = await page.$(`#${focusElement}`);
      //input?.type(formData[focusElement]);
    }
  }
  if (eventType === "viewPort") {
    promises.push(
      page.setViewport({
        width: event.events?.size?.width,
        height: event.events?.size?.height,
      })
    );
  }
  if (eventType === "mouseDown") {
    promises.push(page.mouse.down(event.events.button));
  }
  if (eventType === "mouseMove") {
    promises.push(
      page.mouse.move(event.events.position.x, event.events.position.y)
    );
  }
  if (eventType === "scroll") {
    promises.push(
      page.evaluate((scrollPosition) => {
        const x = scrollPosition?.x || 0;
        const y = scrollPosition?.y || 0;
        window.scrollTo(x, y);
      }, event.events.scrollPosition)
    );
  }
  if (eventType === "mutation") {
    const data = safelyParse(event.events.mutation);
    const mutations: any = Object.values(data);
    promises.push(handleMutation(mutations, page, chainOfMutations));
  }
  if (eventType !== "mutation" && previousEvents.includes("mutation")) {
    const indexOfMutation = previousEvents.indexOf("mutation");
    const muationEvent = chainOfEvents[indexOfMutation];
    const data = safelyParse(muationEvent.events.mutation);
    const mutations: any = Object.values(data);
    promises.push(handleMutation(mutations, page, chainOfMutations));
  }
  await Promise.all(promises);
  return event.events.timestamp;
}

const getKeyCode = (key: string) => {
  const modifiers = Object.keys(KEYS);
  let keyCode = "";
  if (modifiers.includes(key)) {
    if (key === "Backspace") keyCode = "\\\\b";
  } else keyCode = key;

  return keyCode;
};

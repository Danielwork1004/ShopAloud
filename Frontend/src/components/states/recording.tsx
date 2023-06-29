import { add } from "lodash";
import { useEffect, useRef, useState } from "preact/hooks";
import { useClickEvents } from "../../hooks/useClickEvents";
import { useMouseAndScrollPosition } from "../../hooks/useMouseAndScrollPosition";
import { useMutationObservable } from "../../hooks/useMutationObservable";
import { useSessionMachine } from "../../hooks/useSessionMachine";
import { useSocket } from "../../hooks/useSocket";
import { stringify_object } from "../../utils";
import { SecondaryButton } from "../secondaryButton";

export const Recording = () => {
  const [, sendEvent] = useSessionMachine();
  const { sendData, startRecording, transmitEvent } = useSocket();
  const [events, setEvents] = useState<any>();
  const [viewPort, setViewPort] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    timestamp: new Date().getTime(),
  });

  const mousemoveTimeout = useRef<any>();
  const scrollTimeout = useRef<any>();
  useEffect(() => {
    startRecording();
    const handleKeyDown = (event: any) => {
      if (event.target.type !== "password") {
        const newEvent = {
          type: "keydown",
          keyCode: event.key,
          // html: JSON.stringify(document.documentElement.outerHTML),
          timestamp: new Date().getTime(),
        };
        setEvents(newEvent);
      }
    };
    const handleMouseMove = (event: any) => {
      clearTimeout(mousemoveTimeout.current);
      const newEvent = {
        type: "mouseMove",
        position: { x: event.clientX, y: event.clientY },
        // html: JSON.stringify(document.documentElement.outerHTML),
        timestamp: new Date().getTime(),
      };
      // console.log(mousemoveTimeout.current)
      mousemoveTimeout.current = setTimeout(() => {
        console.log("mouse move");
        setEvents(newEvent);
      }, 100);
    };
    const handleMouseDown = (event: any) => {
      const newEvent = {
        type: "mouseDown",
        button: event.button,
        // html: JSON.stringify(document.documentElement.outerHTML),
        timestamp: new Date().getTime(),
      };
      setEvents(newEvent);
    };
    const handleViewport = () => {
      setViewPort({
        width: window.innerWidth,
        height: window.innerHeight,
        timestamp: new Date().getTime(),
      });
    };
    const handleScroll = () => {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setEvents({
          type: "scroll",
          scrollPosition: {
            x: window.scrollX,
            y: window.scrollY,
          },
          // html: JSON.stringify(document.documentElement.outerHTML),
          timestamp: new Date().getTime(),
        });
      }, 50);
    };
    const handleFocus = (event: any) => {
      setEvents({
        type: "focus",
        focusElement: JSON.stringify(event.target.id),
        // html: JSON.stringify(document.documentElement.outerHTML),
        timestamp: new Date().getTime(),
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("resize", handleViewport);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("focus", handleFocus, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("resize", handleViewport);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("focus", handleFocus, true);
    };
  }, []);

  useEffect(() => {
    if (events) {
      transmitEvent(events);
    }
  }, [events]);

  useEffect(() => {
    setEvents({
      type: "viewPort",
      size: {
        ...viewPort,
      },
      timestamp: new Date().getTime(),
    });
  }, [viewPort]);

  useEffect(() => {
    const inputs = document.querySelectorAll('input:not([type="password"]),textarea');
    const formData: any = {};

    inputs.forEach((input) => {
      const key = (input as HTMLInputElement).id;
      const value = (input as HTMLInputElement).value;
      formData[key] = value;
    });
    setEvents({
      type: "initialState",
      html: JSON.stringify(document.documentElement.outerHTML),
      initialScrollPosition: window.scrollY,
      formData,
      timestamp: new Date().getTime(),
    });
  }, []);

  useMutationObservable(document, (mutationList: any) => {
    //console.log("called mutation list")
    console.log(mutationList);
    setEvents({
      type: "mutation",
      mutation: stringify_object(mutationList),
      timestamp: new Date().getTime(),
    });
    sendData({ key: "dom:mutation", data: mutationList });
  });

  useMouseAndScrollPosition({
    onMouseData: ({ x, y }) => {
      //console.log("called mouse data")
      sendData({ key: "mouse:position", data: { x, y } });
    },
    onScrollData: ({ scrollX, scrollY }) => {
      //console.log("called scroll data")
      sendData({ key: "scroll:position", data: { scrollX, scrollY } });
    },
  });

  useClickEvents({
    onClick: (event) => {
      //console.log("called click event")
      sendData({ key: "click:event", data: event });
    },
  });

  return (
    <div>
      <p>Recording...</p>
      <SecondaryButton onClick={() => sendEvent("SUCCESS")}>
        Stop
      </SecondaryButton>
    </div>
  );
};

export type EVENT_TYPES =
  | "keydown"
  | "mouseMove"
  | "mouseDown"
  | "mutation"
  | "scroll"
  | "viewPort"
  | "initialState"
  | "focus";
export type IEvent = {
  events: {
    type: EVENT_TYPES;
    position?: any;
    button?: any;
    keyCode?: any;
    mutation?: any;
    scrollPosition?: {
      x: number;
      y: number;
    };
    size?: {
      width: any;
      height: any;
    };
    html: any;
    initialScrollPosition: any;
    focusElement: any;
    formData: any;
    timestamp: number;
  };
  url: string;
};
export type IEvents = [[IEvent]];

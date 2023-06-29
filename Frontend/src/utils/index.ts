import { Dictionary } from "typed-two-way-map";

// generate uuid
export const uuid4 = (): string => {
  return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
  );
};

export const stringify_object = (
  object: Dictionary<any>,
  depth = 0,
  max_depth = 4
) => {
  if (depth > max_depth) {
    return "Object";
  }

  const obj: Dictionary<any> = {};
  for (let key in object) {
    let value = object[key];
    if (value instanceof HTMLElement) {
      const {
        id,
        className,
        nodeName,
        classList,
        tagName,
        localName,
        innerText,
      } = value;
      value = { id, className, nodeName, tagName, localName, innerText };
    } else if (value instanceof Window) {
      value = "Window";
    } else if (value instanceof Object) {
      value = stringify_object(value, depth + 1, max_depth);
    }

    obj[key] = value;
  }

  return depth ? obj : JSON.stringify(obj);
};

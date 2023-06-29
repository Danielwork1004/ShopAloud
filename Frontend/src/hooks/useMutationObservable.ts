import { useEffect, useState } from "preact/hooks";

const DEFAULT_OPTIONS = {
  config: { attributes: true, childList: true, subtree: true , characterData: true},
  debounceTime: 0
};

export const useMutationObservable = (targetEl: HTMLElement | Document, cb: (mutationList: any) => void, options = DEFAULT_OPTIONS) => {
  const [observer, setObserver] = useState<MutationObserver | null>(null);

  useEffect(() => {
    if (!cb || typeof cb !== "function") {
      console.warn(
        `You must provide a valid callback function, instead you've provided ${cb}`
      );
      return;
    }
    const { debounceTime } = options;
    const obs = new MutationObserver(cb);
    setObserver(obs);
  }, [cb, options, setObserver]);
  useEffect(() => {
    if (!observer) return;
    if (!targetEl) {
      console.warn(
        `You must provide a valid DOM element to observe, instead you've provided ${targetEl}`
      );
    }
    const { config } = options;
    try {
      observer.observe(targetEl, config);
    } catch (e) {
      console.error(e);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer, targetEl, options]);
}
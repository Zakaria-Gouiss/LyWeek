import { useEffect, useRef, useState } from "react";

export default function useNotesSavedToast() {
  const [toastMessage, setToastMessage] = useState("");
  const [isToastFading, setIsToastFading] = useState(false);
  const fadeTimeoutRef = useRef(null);
  const dismissTimeoutRef = useRef(null);

  function showNotesSavedToast(message) {
    if (fadeTimeoutRef.current !== null) {
      clearTimeout(fadeTimeoutRef.current);
    }
    if (dismissTimeoutRef.current !== null) {
      clearTimeout(dismissTimeoutRef.current);
    }

    setToastMessage(message);
    setIsToastFading(false);
    fadeTimeoutRef.current = setTimeout(() => {
      setIsToastFading(true);
      fadeTimeoutRef.current = null;
    }, 1800);
    dismissTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
      setIsToastFading(false);
      dismissTimeoutRef.current = null;
    }, 4000);
  }

  useEffect(
    () => () => {
      if (fadeTimeoutRef.current !== null) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (dismissTimeoutRef.current !== null) {
        clearTimeout(dismissTimeoutRef.current);
      }
    },
    [],
  );

  return { toastMessage, isToastFading, showNotesSavedToast };
}

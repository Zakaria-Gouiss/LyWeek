import { useEffect, useRef, useState } from "react";

export default function useNotesSavedToast() {
  const [toastMessage, setToastMessage] = useState("");
  const timeoutRef = useRef(null);

  function showNotesSavedToast(message) {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    setToastMessage(message);
    timeoutRef.current = setTimeout(() => {
      setToastMessage("");
      timeoutRef.current = null;
    }, 4000);
  }

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return { toastMessage, showNotesSavedToast };
}

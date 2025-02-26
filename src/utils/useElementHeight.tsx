import { useState, useEffect, RefObject } from "react";

const useElementHeight = (elementRef: RefObject<HTMLElement | null>) => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const updateHeight = () => {
      if (elementRef.current) {
        setHeight(elementRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [elementRef]);
  return height;
};
export default useElementHeight;

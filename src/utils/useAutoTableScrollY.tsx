import { useEffect, useRef, useState } from "react";

export function useAutoTableScrollY(offset = 150) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState<number>(300); // mặc định

  useEffect(() => {
    const calculateScrollHeight = () => {
      const wrapper = tableWrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const availableHeight = window.innerHeight - rect.top - offset;

      setBodyHeight(availableHeight > 100 ? availableHeight : 100);
    };

    calculateScrollHeight(); // lần đầu
    window.addEventListener("resize", calculateScrollHeight);
    return () => window.removeEventListener("resize", calculateScrollHeight);
  }, [offset]);

  return { tableWrapperRef, bodyHeight };
}

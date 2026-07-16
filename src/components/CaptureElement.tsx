import React, { useRef, useEffect, ReactNode } from "react";
import { toBlob } from "html-to-image";

export type CaptureFormat = "png" | "jpeg" | "svg";

export interface CaptureElementProps {
  children: ReactNode;
  deps?: any[];
  delay?: number;
  onCapture?: (file: File) => void;
  quality?: number;
  /** Độ phân giải (pixel ratio) – mặc định 2 để ảnh sắc nét */
  pixelRatio?: number;
  /** Xoá cache ảnh bằng cách thêm timestamp */
  cacheBust?: boolean;
  format?: CaptureFormat;
  enabled?: boolean;
}

const CaptureElement: React.FC<CaptureElementProps> = ({
  children,
  deps = [],
  delay = 300,
  onCapture,
  quality = 1,
  pixelRatio = 2,
  cacheBust = true,
  format = "png",
  enabled = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(async () => {
      if (!ref.current) return;
      try {
        const node = ref.current;
        const options = {
          quality,
          pixelRatio,
          cacheBust,
          backgroundColor: undefined,

          width: node.offsetWidth,
          height: node.offsetHeight,

          style: {
            margin: "0",
            padding: "0",
            transform: "none",
          },
        };
        const blob = await toBlob(ref.current, options);
        if (!blob) return;
        const file = new File([blob], `captured-image.${format}`, {
          type: `image/${format}`,
          lastModified: Date.now(),
        });
        console.log("CAPTURE FILE", file, URL.createObjectURL(file));
        onCapture?.(file);
      } catch (err) {
        console.error(err);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [enabled, ...deps]);
  return (
    <div
      ref={ref}
      style={{
        display: "block",
        width: "100%",
        height: "fit-content",
        lineHeight: 0,
        borderRadius: 22,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default CaptureElement;

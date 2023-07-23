import { useEffect, useRef, useState } from "react";
import { Position } from "./PlayCard";

function handleResize(
  el: HTMLDivElement,
  updatePosCb: (pos: Position) => void,
  updateWindowSizeCb: (windowX: number, windowY: number) => void
) {
  const x = el.offsetLeft;
  const y = el.offsetTop;
  updatePosCb({ x: x, y: y });

  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  updateWindowSizeCb(windowX, windowY);
}

export interface Size {
  width: number;
  height: number;
}

function CenterPlaceholder() {
  const elRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!elRef.current) return;
    handleResize(
      elRef.current,
      (pos: Position) => setPos(pos),
      (x, y) => setWindowSize({ width: x, height: y })
    );
    window.addEventListener("resize", () =>
      handleResize(
        elRef.current!,
        (pos: Position) => setPos(pos),
        (x, y) => setWindowSize({ width: x, height: y })
      )
    );
    return () => {
      window.removeEventListener("resize", () => {
        handleResize(
          elRef.current!,
          (pos: Position) => setPos(pos),
          (x, y) => setWindowSize({ width: x, height: y })
        );
      });
    };
  }, [elRef.current]);

  const translateLocation = `translate(-50%, -50%)`;

  return (
    <div
      ref={elRef}
      style={{
        position: "absolute",
        color: "black",
        top: "50%",
        left: "50%",
        transform: translateLocation,
        opacity: "1",
      }}
    >
      this is the center
    </div>
  );
}

export default CenterPlaceholder;

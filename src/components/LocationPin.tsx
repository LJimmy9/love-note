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

interface LocationPinProps {
  location: string;
  handlePos: (pos: number[]) => void;
}

function LocationPin({ location, handlePos }: LocationPinProps) {
  const elRef = useRef<HTMLDivElement>(null);

  const [_pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [_windowSize, setWindowSize] = useState<Size>({ width: 0, height: 0 });

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

    const rect = elRef.current.getBoundingClientRect();
    const x = rect.left;
    const y = rect.top;

    handlePos([x, y]);

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

  function genTargetStyles(x: number, y: number) {
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-${x + 20}%, -${y + 25}%)`,
    };
  }

  function parseLocation(location: string) {
    let x, y;

    switch (location) {
      case "center":
        x = 50;
        y = 50;
        break;
      case "center_left":
        x = 0;
        y = 50;
        break;
      case "center_right":
        x = 100;
        y = 50;
        break;
      case "bottom_right":
        x = 100;
        y = 100;
        break;
      case "bottom_left":
        x = 0;
        y = 100;
        break;
      case "bottom":
        x = 50;
        y = 100;
        break;
      case "top":
        x = 50;
        y = 0;
        break;
      case "top_left":
      x = 0;
        y = 10;
        break;
      case "top_right":
        x = 100;
        y = 10;
        break;
      default:
        x = 50;
        y = 50;
    }

    return genTargetStyles(x, y);
  }

  const target = parseLocation(location);

  return (
    <div
      ref={elRef}
      style={{
        ...target,
        width: "8ch",
        height: "16ch",
        position: "absolute",
        color: "black",
        opacity: "0",
        border: "1px solid black",
      }}
    >
      pin is here
    </div>
  );
}

export default LocationPin;

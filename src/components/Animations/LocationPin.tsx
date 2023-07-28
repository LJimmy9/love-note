import { useEffect, useRef, useState } from "react";
import { $doneAnimating } from "../../state/animations";
import { useSetAtom } from "jotai";

export interface Size {
  width: number;
  height: number;
}

interface LocationPinProps {
  start: string;
  target: string;
}

function LocationPin({ start, target }: LocationPinProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState(parseStyles(start));

  const doneAnimating = useSetAtom($doneAnimating);

  useEffect(() => {
    setStyle(parseStyles(target));
  }, []);

  function parseLocation(location: string) {
    let x, y;

    switch (location) {
      case "center":
        x = -50;
        y = -50;
        break;
      case "center_left":
        x = -150;
        y = -50;
        break;
      case "center_right":
        x = 50;
        y = -50;
        break;
      case "bottom":
        x = -50;
        y = 100;
        break;
      case "top":
        x = -50;
        y = -150;
        break;
      default:
        x = 50;
        y = 50;
    }
    return [x, y];
  }

  function parseStyles(target: string) {
    const pos = parseLocation(target);
    return {
      // transform: `translate(${pos[0]}%, ${pos[1]}%)`,
      translate: `${pos[0]}% ${pos[1]}%`,
    };
  }

  return (
    <div
      ref={elRef}
      style={{
        ...style,
        top: "50%",
        left: "50%",
        width: "6ch",
        height: "10ch",
        borderRadius: "1rem",
        backgroundColor: "#ffb7c5",
        border: "5px solid #c8a2c8",
        color: "black",
        position: "absolute",
        transition: "1s ease-in-out",
        transformOrigin: "center",
      }}
      hidden={false}
      onTransitionEnd={doneAnimating}
    ></div>
  );
}

export default LocationPin;

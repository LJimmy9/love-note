import { useAtomValue, useSetAtom } from "jotai";
import { $currAnimation, $isAnimating } from "../state/animations";
import LocationPin from "./LocationPin";
import { useEffect } from "react";

interface Animations {
  [key: string]: string[][];
}

function AnimGen() {
  const isAnimating = useAtomValue($isAnimating);
  const currAnimation = useAtomValue($currAnimation);

  const anims: Animations = {
    allPassRight: [
      ["bottom", "center_left"],
      ["center_left", "top"],
      ["top", "center_right"],
      ["center_right", "bottom"],
    ],
    allPassLeft: [
      ["bottom", "center_right"],
      ["center_right", "top"],
      ["top", "center_left"],
      ["center_left", "bottom"],
    ],
    passLeft: [["bottom", "center_left"]],
    passRight: [["bottom", "center_right"]],
  };

  useEffect(() => {
    // playAnimation(anims.passLeft[1]);
  }, []);

  return anims[currAnimation] && isAnimating
    ? anims[currAnimation].map((anim, idx) => {
        return (
          <LocationPin
            key={`cid-${anim[1]}-${idx}`}
            start={anim[0]}
            target={anim[1]}
          />
        );
      })
    : null;
}

export default AnimGen;

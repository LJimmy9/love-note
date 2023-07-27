import { useAtomValue } from "jotai";
import { $currAnimation, $isAnimating } from "../state/animations";
import LocationPin from "./LocationPin";
import { $runePlayer } from "../state/game";

interface Animations {
  [key: string]: string[][];
}

function AnimGen() {
  const isAnimating = useAtomValue($isAnimating);
  const currAnimation = useAtomValue($currAnimation);

  const rP = useAtomValue($runePlayer);

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

  return anims[currAnimation] && isAnimating
    ? anims[currAnimation].map((an, idx) => {
        return (
          <LocationPin
            key={`${rP.displayName}-${idx}`}
            start={an[0]}
            target={an[1]}
          />
        );
      })
    : null;
}

export default AnimGen;

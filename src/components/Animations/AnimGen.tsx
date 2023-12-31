import { useAtomValue } from "jotai";
import { $currAnimation } from "../../state/animations";
import PlaceholderCard, { AnimConfig } from "./PlaceholderCard";

interface Animations {
  [key: string]: AnimConfig[];
}

function AnimGen() {
  const currAnimation = useAtomValue($currAnimation);

  const anims: Animations = {
    allPassRight: [
      ["bottom", "right"],
      ["right", "top"],
      ["top", "left"],
      ["left", "bottom"],
    ],
    allPassLeft: [
      ["bottom", "left"],
      ["left", "top"],
      ["top", "right"],
      ["right", "bottom"],
    ],
    playerPassLeft: [["bottom", "left"]],
    playerPassRight: [["bottom", "right"]],
    playerPassTop: [["bottom", "top"]],
    playCenter: [["bottom", "center"]],
    leftToCenter: [["left", "center"]],
    topToCenter: [["top", "center"]],
    rightToCenter: [["right", "center"]],
    circlePlay: [["circle", "circle"]],
  };

  return currAnimation != ""
    ? anims[currAnimation].map((an, idx) => {
        return <PlaceholderCard key={`${idx}`} animConfig={an} />;
      })
    : null;
}

export default AnimGen;

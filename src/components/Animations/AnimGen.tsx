import { useAtomValue } from "jotai";
import { $currAnimation } from "../../state/animations";
import { $runePlayer } from "../../state/game";
import PlaceholderCard, { AnimConfig } from "./PlaceholderCard";

interface Animations {
  [key: string]: AnimConfig[];
}

function AnimGen() {
  const currAnimation = useAtomValue($currAnimation);

  const rP = useAtomValue($runePlayer);

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
  };

  // return (
  //   <PlaceholderCard key={`${rP.playerId}-`} animConfig={["left", "bottom"]} />
  // );
  return currAnimation != ""
    ? anims[currAnimation].map((an, idx) => {
        return <PlaceholderCard key={`${idx}`} animConfig={an} />;
      })
    : null;
}

export default AnimGen;

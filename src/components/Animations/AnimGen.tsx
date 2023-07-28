import { useAtomValue } from "jotai";
import { $currAnimation, $isAnimating } from "../../state/animations";
import LocationPin from "./LocationPin";
import { $runePlayer } from "../../state/game";
import PlaceholderCard, { AnimConfig } from "./PlaceholderCard";

interface Animations {
  [key: string]: AnimConfig[];
}

function AnimGen() {
  const isAnimating = useAtomValue($isAnimating);
  const currAnimation = useAtomValue($currAnimation);

  const rP = useAtomValue($runePlayer);

  const anims: Animations = {
    allPassRight: [
      ["bottom", "center"],
      ["center", "top"],
      ["top", "center"],
      ["center", "bottom"],
    ],
    allPassLeft: [
      ["bottom", "center"],
      ["center", "top"],
      ["top", "center"],
      ["center", "bottom"],
    ],
    passLeft: [["bottom", "center"]],
    passRight: [["bottom", "center"]],
    playCenter: [["bottom", "center"]],
  };

  // return (
  //   <PlaceholderCard
  //     key={`${rP.playerId}-`}
  //     animConfig={["bottom", "center"]}
  //   />
  // );
  return currAnimation != ""
    ? anims[currAnimation].map((an, idx) => {
        return (
          <PlaceholderCard
            key={`${rP.playerId}-${an[0]}-${idx}`}
            animConfig={an}
          />
        );
      })
    : null;
  // return anims[currAnimation] && isAnimating
  //   ? anims[currAnimation].map((an, idx) => {
  //       return (
  //         <LocationPin
  //           key={`${idx}-${rP.playerId}-${rP.displayName}-${an[0]}`}
  //           start={an[0]}
  //           target={an[1]}
  //         />
  //       );
  //     })
  //   : null;
}

export default AnimGen;

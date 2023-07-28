import { useSetAtom } from "jotai";
import { $doneAnimating } from "../../state/animations";
import s from "./LocationPin.module.css";

export type AnimConfig = [string, string];
interface PlaceholderCardProps {
  animConfig: AnimConfig;
}

function PlaceholderCard({ animConfig }: PlaceholderCardProps) {
  const animationDone = useSetAtom($doneAnimating);

  function parse(animConfig: AnimConfig) {
    switch (animConfig[0]) {
      case "bottom":
        switch (animConfig[1]) {
          case "center":
            return `${s.bottom} ${s.bottomToCenter}`;

          default:
            return s.noAnim;
        }
      default:
        return s.NoAnim;
    }
  }

  function parseTarget(targetClass: string) {
    switch (targetClass) {
      case "center":
        return s.centerToLeft;
      default:
        return s.noAnim;
    }
  }

  function parseStart(startClass: string) {
    switch (startClass) {
      case "top":
        return s.top;
      case "left":
        return s.left;
      case "right":
        return s.right;
      case "bottom":
        return s.bottom;
      case "center":
        return s.center;
      default:
        return s.noAnim;
    }
  }

  return (
    <div
      className={`${s.placeholderCard} ${parse(animConfig)} `}
      // className={`${s.placeholderCard} ${parseStart(
      //   animConfig[0]
      // )} ${parseTarget(animConfig[1])}`}
      onAnimationEnd={() => {
        animationDone();
      }}
    >
      YOU ARE HERE{" "}
    </div>
  );
}

export default PlaceholderCard;

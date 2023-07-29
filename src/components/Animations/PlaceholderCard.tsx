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
    let start;
    switch (animConfig[0]) {
      case "bottom":
        start = `${s.bottom} `;
        switch (animConfig[1]) {
          case "center":
            return start + `${s.bottomToCenter}`;
          case "left":
            return start + `${s.bottomToLeft}`;
          case "right":
            return start + `${s.bottomToRight}`;
          case "top":
            return start + `${s.bottomToTop}`;
          default:
            return s.noAnim;
        }
      case "left":
        start = `${s.left} `;
        switch (animConfig[1]) {
          case "top":
            return start + `${s.leftToTop}`;
          case "bottom":
            return start + `${s.leftToBottom}`;
          case "center":
            return start + `${s.leftToCenter}`;
          default:
            return s.noAnim;
        }
      case "top":
        start = `${s.top} `;
        switch (animConfig[1]) {
          case "right":
            return start + `${s.topToRight}`;
          case "left":
            return start + `${s.topToLeft}`;
          case "center":
            return start + `${s.topToCenter}`;
          default:
            return s.noAnim;
        }
      case "right":
        start = `${s.right} `;
        switch (animConfig[1]) {
          case "bottom":
            return start + `${s.rightToBottom}`;
          case "top":
            return start + `${s.rightToTop}`;
          case "center":
            return start + `${s.rightToCenter}`;
          default:
            return s.noAnim;
        }
      case "circle":
        return s.circleAnim;
      default:
        return s.NoAnim;
    }
  }

  return (
    <div
      className={`${s.placeholderCard} ${parse(animConfig)} `}
      onAnimationEnd={() => {
        animationDone();
      }}
    ></div>
  );
}

export default PlaceholderCard;

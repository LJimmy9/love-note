import { useAtomValue } from "jotai";
import { $gameState } from "../../state/game";
import { TattleProps } from "../CardAction/Tattle";
import a from "./AbsentSideEffect.module.css";
import { useState } from "react";

function AbsentSideEffect({ players }: TattleProps) {
  const gameState = useAtomValue($gameState);
  const [showText, setShowText] = useState<boolean>(false);

  return (
    <>
      <div
        className={`${a.info} ${a.fadeIn}`}
        onAnimationEnd={() => setShowText(true)}
      >
        {players[gameState.tattledOn].displayName} was absent! The teacher did
        not believe they were passing notes.
        <div className={a.ghost}>👻🙅‍♂️🙅‍♀️👻</div>
      </div>
      {showText && (
        <div
          className={`${a.afterText} ${a.fadeIn}`}
          onAnimationEnd={() => Rune.actions.updateCurrentTurn()}
        >
          Not today Tattle Tale! 💓
        </div>
      )}
    </>
  );
}

export default AbsentSideEffect;

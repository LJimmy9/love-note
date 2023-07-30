import { useAtomValue } from "jotai";
import { $gameState, $runePlayer } from "../../state/game";
import { TattleProps } from "../CardAction/Tattle";
import a from "./AbsentSideEffect.module.css";
import { useState } from "react";

function AbsentSideEffect({ players }: TattleProps) {
  const gameState = useAtomValue($gameState);
  const currPlayer = useAtomValue($runePlayer);
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
          onAnimationEnd={() => {
            if (gameState.currentTurn !== currPlayer.playerId) return;
            Rune.actions.updateCurrentTurn();
          }}
        >
          Not today Tattle Tale! 💓
        </div>
      )}
    </>
  );
}

export default AbsentSideEffect;

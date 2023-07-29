import { useAtomValue } from "jotai";
import { $gameState } from "../../state/game";
import { TattleProps } from "../CardAction/Tattle";
import a from "./AbsentSideEffect.module.css";
import { useState } from "react";

function LastWordsSideEffect({ players }: TattleProps) {
  const gameState = useAtomValue($gameState);
  const [showText, setShowText] = useState<boolean>(false);

  return (
    <>
      <div
        className={`${a.info} ${a.fadeIn}`}
        onAnimationEnd={() => setShowText(true)}
      >
        {players[gameState.tattledOn].displayName} says{" "}
        {gameState.players[gameState.tattledOn].sideEffect.receiveFrom}!
      </div>
      {showText && (
        <div
          className={`${a.afterText} ${a.fadeIn}`}
          onAnimationEnd={() => Rune.actions.handleGameEnd()}
        >
          Good Game 💘
        </div>
      )}
    </>
  );
}

export default LastWordsSideEffect;

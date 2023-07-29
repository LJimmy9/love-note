import { useAtomValue } from "jotai";
import { $gameState } from "../../state/game";
import { TattleProps } from "../CardAction/Tattle";
import a from "./AbsentSideEffect.module.css";
import { useState } from "react";

function LastWordsSideEffect({ players }: TattleProps) {
  const gameState = useAtomValue($gameState);
  const [showText, setShowText] = useState<boolean>(false);
  const [showGoodGame, setShowGoodGame] = useState<boolean>(false);

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
        <div className={a.fadeIn} onAnimationEnd={() => setShowGoodGame(true)}>
          <div className={a.info}>
            {players[gameState.tattledOn].displayName} was a{" "}
            {gameState.players[gameState.tattledOn].playerIdentity.role}!
          </div>
          <div className={a.info}>
            {players[gameState.currentTurn].displayName}{" "}
            {`${
              gameState.players[gameState.tattledOn].playerIdentity.role ===
              "Friend"
                ? "failed in"
                : "succeeded in"
            }`}{" "}
            tattling on the lovers.
          </div>
        </div>
      )}
      {showGoodGame && (
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

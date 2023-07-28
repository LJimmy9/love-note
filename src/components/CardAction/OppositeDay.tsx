import React, { useEffect } from "react";
import od from "./OppositeDay.module.css";
import { $gameState, $runePlayer } from "../../state/game";
import { useAtomValue } from "jotai";

const OppositeDay = () => {
  const currPlayer = useAtomValue($runePlayer);
  const gameState = useAtomValue($gameState);

  return (
    <div
      className={od.oppositeContainer}
      onAnimationEnd={() => {
        if (currPlayer.playerId !== gameState.currentTurn) return;
        Rune.actions.updateCurrentTurn();
      }}
    >
      <p
        style={{ textAlign: "left" }}
      >{`Direction is now to the ${gameState.direction} and the ${gameState.priority} number card in your hand`}</p>
    </div>
  );
};

export default OppositeDay;

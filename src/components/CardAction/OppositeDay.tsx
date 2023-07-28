import React, { useEffect } from "react";
import od from "./OppositeDay.module.css";
import { $gameState } from "../../state/game";
import { useAtomValue } from "jotai";

const OppositeDay = () => {
  const gameState = useAtomValue($gameState);
  useEffect(() => {
    Rune.actions.updateDirectionPriority();
  }, []);

  return (
    <div
      className={od.oppositeContainer}
      onAnimationEnd={() => Rune.actions.updateCurrentTurn()}
    >
      <p
        style={{ textAlign: "left" }}
      >{`Direction is now to the ${gameState.direction} and the ${gameState.priority} number card in your hand`}</p>
    </div>
  );
};

export default OppositeDay;

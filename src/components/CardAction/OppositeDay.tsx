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
      <p style={{ textAlign: "left" }}>{`It's opposite day!`}</p>
    </div>
  );
};

export default OppositeDay;

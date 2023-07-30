import od from "./OppositeDay.module.css";
import { $gameState } from "../../state/game";
import { useAtomValue } from "jotai";
import { useState } from "react";

const OppositeDay = () => {
  const gameState = useAtomValue($gameState);
  const [direction, setDirection] = useState<string>(gameState.direction);
  const [priority, setPriority] = useState<string>(gameState.priority);
  const [directionSelected, setDirectionSelected] = useState<boolean>(false);
  const [prioritySelected, setPrioritySelected] = useState<boolean>(false);

  return (
    <div>
      <div className={od.instruction}>
        It's opposite day! You must change the direction or priority, or both.
      </div>
      <div
        className={od.priority}
        onClick={() => {
          setPriority(priority === "lowest" ? "highest" : "lowest");
          setPrioritySelected(!prioritySelected);
        }}
      >
        <span className={`${prioritySelected ? od.selected : ""}`}>{`${
          priority === "lowest" ? "⬇️" : "⬆️"
        }`}</span>
      </div>
      <div
        className={od.direction}
        onClick={() => {
          setDirection(direction === "right" ? "left" : "right");
          setDirectionSelected(!directionSelected);
        }}
      >
        <span className={`${directionSelected ? od.selected : ""}`}>{`${
          direction === "right" ? "➡️" : "⬅️"
        }`}</span>
      </div>

      <div className={od.resultTxt}>
        Card swapping is {priority} card to the {direction}.
      </div>
      {(directionSelected || prioritySelected) && (
        <div
          style={{
            cursor: "pointer",
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translate(-50%, 50%)",
            fontSize: "60px",
          }}
          onClick={() => {
            Rune.actions.updateForOppositeDay({ direction, priority });
          }}
        >
          👌
        </div>
      )}
    </div>
  );
};

export default OppositeDay;

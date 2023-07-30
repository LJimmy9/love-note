import { SetStateAction, useAtomValue } from "jotai";
import { $game } from "../state/game";
import { Dispatch } from "react";

import gf from "./GameField.module.scss";
import gi from "./GameInfo.module.css";

interface InfoHeaderProps {
  showInfo: boolean;
  setShowInfo: Dispatch<SetStateAction<boolean>>;
}

export const InfoHeader = ({ showInfo, setShowInfo }: InfoHeaderProps) => {
  const game = useAtomValue($game);
  if (!game) return;

  return (
    <div className={gf.currentGameDetail}>
      <div className={gf.turnContainer}>
        {/* <div className={gi.directionPriority}>
          <p>Direction: {game.gameState.direction == "left" ? "⬅️" : "➡️"}</p>
          <p>Priority: {game.gameState.priority == "highest" ? "⬆️" : "⬇️"} </p>
        </div> */}
        <p className={gf.playerTurn}>
          Player Turn:{" "}
          {`${
            game.yourPlayerId === game.gameState.currentTurn
              ? "Your turn"
              : game.players[game.gameState.currentTurn].displayName
          }`}
        </p>
        <p>{`Game Phase: ${game.gameState.gamePhase}`}</p>
      </div>
      <div className={gi.infoButtonContainer}>
        <button onClick={() => setShowInfo(!showInfo)} className={gi.infoBtn}>
          info
        </button>
      </div>
    </div>
  );
};

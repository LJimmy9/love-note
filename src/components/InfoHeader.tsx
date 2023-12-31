import { SetStateAction, useAtomValue } from "jotai";
import { $game } from "../state/game";
import { Dispatch } from "react";

import gf from "./GameField.module.scss";
import gi from "./GameInfo.module.scss";

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
      <div
        className={gi.infoButtonContainer}
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className={gi.infoBtn}>i</div>
      </div>
    </div>
  );
};

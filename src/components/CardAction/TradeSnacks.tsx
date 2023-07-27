import { PlayerId } from "rune-games-sdk/multiplayer";
import { $runePlayer, AtomPlayer } from "../../state/game";
import { AtomPlayerObj } from "../ResolveCard";
import ts from "./TradeSnacks.module.css";
import { useState } from "react";
import { useAtomValue } from "jotai";

export interface TradeSnacksProps {
  players: AtomPlayerObj;
}

function TradeSnacks({ players }: TradeSnacksProps) {
  const currPlayer = useAtomValue($runePlayer);
  const [selectedId, setSelectedId] = useState<PlayerId>("");

  return (
    <div>
      <div className={ts.instruction}>
        Select a player to exchange cards with
      </div>
      <div className={ts.playerSelectionContainer}>
        {Object.keys(players).map((playerId) => {
          const player: AtomPlayer = players[playerId as PlayerId];
          if (playerId == currPlayer.playerId) return null;
          return (
            <div
              key={`trade-${playerId}`}
              className={ts.playerSelection}
              onClick={() => {
                setSelectedId(playerId);
              }}
            >
              {player.displayName}
              {selectedId == playerId && (
                <span style={{ marginLeft: "5px" }}>✔️</span>
              )}
            </div>
          );
        })}
      </div>
      <div
        className={ts.doneBtn}
        onClick={() => {
          Rune.actions.handleCard({
            cardNum: 3,
            playersInvolved: [selectedId, currPlayer.playerId],
          });
        }}
      >
        👌
      </div>
    </div>
  );
}

export default TradeSnacks;

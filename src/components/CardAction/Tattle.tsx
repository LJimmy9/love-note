import { PlayerId } from "rune-games-sdk/multiplayer";
import { AtomPlayer, $runePlayer } from "../../state/game";
import { AtomPlayerObj } from "../ResolveCard";
import ts from "./TradeSnacks.module.scss";
import { useState } from "react";
import { useAtomValue } from "jotai";

export interface TattleProps {
  players: AtomPlayerObj;
}

function Tattle({ players }: TattleProps) {
  const currPlayer = useAtomValue($runePlayer);
  const [selectedId, setSelectedId] = useState<PlayerId>("");

  return (
    <div>
      <div className={ts.instruction}>
        Select a player to Tattle on! Choose wisely, this will send the player
        to detention.
      </div>
      <div style={{ fontSize: "25px", marginTop: "10px" }}>📣😮</div>
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
              <img className={ts.avatar} src={player.avatarUrl} />
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
            cardNum: 1,
            playersInvolved: [
              selectedId,
              ...Object.keys(players).filter(
                (playerId) => playerId !== selectedId
              ),
            ],
          });
        }}
      >
        👌
      </div>
    </div>
  );
}

export default Tattle;

import { PlayerId } from "rune-games-sdk/multiplayer";
import { SetStateAction, useAtomValue } from "jotai";
import { $game, $runePlayer } from "../state/game";
import { Dispatch } from "react";
import { CardRotationConfig } from "./Game";
import PlayCard from "./PlayCard";

import gi from "./GameInfo.module.css";
import gf from "./GameField.module.css";
import ph from "./PlayerHand.module.css";

interface OppponentHandProps {
  activePlayer: string;
  playerId: PlayerId;
  idx: number;
  pinPos: number[];
  cardRotationConfig: CardRotationConfig;
  setActivePlayer: Dispatch<SetStateAction<string>>;
}

type classMapConfig = {
  [key: number]: string;
};

const classMap: classMapConfig = {
  1: `${gf.otherplayerLeftBottom}`,
  2: `${gf.otherplayerRightBottom}`,
  3: `${gf.otherplayerLeftMiddle}`,
  4: `${gf.otherplayerRightMiddle}`,
};

export const OppponentHand = ({
  activePlayer,
  playerId,
  idx,
  pinPos,
  cardRotationConfig,
  setActivePlayer,
}: OppponentHandProps) => {
  const game = useAtomValue($game);
  const currPlayer = useAtomValue($runePlayer);
  if (!game) return;

  const p = game.gameState.players[playerId];
  const displayPlayerInfo = (id: string) => {
    return id === activePlayer
      ? `${gi.activePlayerInfoContainer}`
      : `${gi.nonActivePlayerInfo}`;
  };

  return (
    <div>
      {activePlayer !== "" && playerId === activePlayer && (
        <div className={displayPlayerInfo(playerId)}>
          <div className={gi.activePlayerInfo}>
            <div className={gi.exitButton} onClick={() => setActivePlayer("")}>
              X
            </div>
            <p>Player Name: {game.players[playerId].displayName}</p>
          </div>
        </div>
      )}
      <div
        className={classMap[idx + 1]}
        key={`gamestate-${idx}-${currPlayer.playerId}`}
      >
        <div style={{ height: "40px" }}>
          <div className={`${ph.flexCenterPlayerHand}`}>
            {p.playerHand.map((cardVal, sphIdx) => {
              return (
                <PlayCard
                  key={`${cardVal}-${sphIdx}-${currPlayer.playerId}`}
                  game={game.gameState}
                  card={cardVal}
                  player={p}
                  cardRotation={cardRotationConfig[sphIdx]}
                  pinPos={pinPos}
                  clickable={false}
                  currentPlayer={playerId === currPlayer.playerId}
                />
              );
            })}
          </div>
        </div>
        <div
          className={`${gf.otherplayerName}`}
          onClick={() => setActivePlayer(playerId)}
          id={`player-${idx}`}
        >
          <svg width="20" height="20">
            <image
              href={game.players[playerId].avatarUrl}
              width="15"
              height="15"
            />
          </svg>
        </div>
        <p className={`${gf.otherplayerName}`}>{p.playerIdentity.name}</p>
      </div>
    </div>
  );
};
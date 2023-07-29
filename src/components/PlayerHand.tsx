import { Player, PlayerId } from "rune-games-sdk/multiplayer";
import { Dispatch, SetStateAction } from "react";
import { useAtomValue } from "jotai";
import { $game } from "../state/game";
import { GamePlayer } from "../logic";
import { CardRotationConfig } from "./Game";
import PlayCard from "./PlayCard";
import idCardData from "../assets/identity-cards.json";

import ph from "./PlayerHand.module.css";
import gi from "./GameInfo.module.css";

interface PlayerHandProps {
  idx: number;
  currPlayer: Player;
  player: GamePlayer;
  playerId: PlayerId;
  pinPos: number[];
  cardRotationConfig: CardRotationConfig;
  showPlayerInfo: boolean;
  setShowPlayerInfo: Dispatch<SetStateAction<boolean>>;
}

export const PlayerHand = ({
  idx,
  currPlayer,
  player,
  playerId,
  showPlayerInfo,
  pinPos,
  cardRotationConfig,
  setShowPlayerInfo,
}: PlayerHandProps) => {
  const game = useAtomValue($game);
  if (!game) return;
  const role = game.gameState.players[currPlayer.playerId].playerIdentity.role;
  const name = game.gameState.players[currPlayer.playerId].playerIdentity.name;
  const roleEmoji =
    role == "Friend"
      ? role + " 🤝"
      : role == "Lover"
      ? role + " ❤️"
      : role + " 🐀";

  const nameEmoji = idCardData.map((id) => {
    if (name == id.name) {
      return name + " " + id.image;
    }
  });

  return (
    <div
      className={`
                ${game.gameState.players[currPlayer.playerId].playerIdentity.role === "Lover" ? ph.playerHandLover : ph.playerHandContainer} 
                ${game.gameState.players[currPlayer.playerId].playerIdentity.role === "Tattle" ? ph.playerHandTattle : ph.playerHandContainer} 
                ${game.gameState.players[currPlayer.playerId].playerIdentity.role === "Friend" ? ph.playerHandFriend: ph.playerHandContainer}
                `}
      key={`gamestate-${idx}-${currPlayer.playerId}`}
      style={{
        zIndex: "10",
      }}
    >
      <div
        className={gi.playerInfoActionContainer}
        onClick={() => setShowPlayerInfo(!showPlayerInfo)}
      >
        <p >{game.gameState.players[currPlayer.playerId].playerIdentity.role}</p>
        <img
          src={game!.players[playerId]["avatarUrl"]}
          style={{
            width: "50px",
          }}
        />
      </div>
      {showPlayerInfo && (
        <div className={gi.playerInfoContainer}>
          <button onClick={() => setShowPlayerInfo(false)}>&times;</button>
          <div className={gi.playerInfoContent}>
            <p>
              <span>Display Name:</span> {currPlayer.displayName}
            </p>{" "}
            <p>
              <span>Role:</span> {roleEmoji}
            </p>
            <p>
              <span>Identity Name:</span> {nameEmoji}
            </p>
            <p>
              <span>Your mission:</span>{" "}
              {
                game.gameState.players[currPlayer.playerId].playerIdentity
                  .description
              }
            </p>
          </div>
        </div>
      )}
      <div className={`${ph.flexCenterPlayerHand}`}>
        {player.playerHand.map((cardVal, phdIdx) => {
          return (
            <div key={`${cardVal}-${phdIdx}`}>
              <PlayCard
                key={`${cardVal}-${phdIdx}-${currPlayer.playerId}`}
                game={game.gameState}
                card={cardVal}
                player={player}
                pinPos={pinPos}
                cardRotation={cardRotationConfig[phdIdx]}
                clickable={true}
                currentPlayer={playerId === currPlayer.playerId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

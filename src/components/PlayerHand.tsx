import { Player, PlayerId } from "rune-games-sdk/multiplayer";
import { Dispatch, SetStateAction } from "react";
import { useAtomValue } from "jotai";
import { $game } from "../state/game";
import { GamePlayer } from "../logic";
import { CardRotationConfig } from "./Game";
import PlayCard from "./PlayCard";
import idCardData from "../assets/identity-cards.json";

import ph from "./PlayerHand.module.scss";
import gi from "./GameInfo.module.scss";
import gf from "./GameField.module.scss";

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
  const currPl = game.gameState.currentTurn;
  const yourId = game.yourPlayerId;
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
      className={`${
        role === "Lover" && currPl != yourId
          ? ph.playerHandLover
          : role === "Lover" && currPl === yourId
          ? ph.playerHandLoverTurn
          : ph.playerHandContainer
      } ${
        role === "Tattle Tale" && currPl != yourId
          ? ph.playerHandTattle
          : role === "Tattle Tale" && currPl === yourId
          ? ph.playerHandTattleTurn
          : ph.playerHandContainer
      } ${
        role === "Friend" && currPl != yourId
          ? ph.playerHandFriend
          : role === "Friend" && currPl === yourId
          ? ph.playerHandFriendTurn
          : ph.playerHandContainer
      }`}
      key={`gamestate-${idx}-${currPlayer.playerId}`}
      style={{
        zIndex: "10",
      }}
    >
      <div
        className={gi.playerInfoActionContainer}
        onClick={() => setShowPlayerInfo(!showPlayerInfo)}
      >
        <p style={{ zIndex: 1 }}>
          {game.gameState.players[currPlayer.playerId].playerIdentity.role}
        </p>
        <img
          src={game?.players[playerId]["avatarUrl"]}
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
            <div key={`${cardVal}-${phdIdx}`} className={gf.currentPlayer}>
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

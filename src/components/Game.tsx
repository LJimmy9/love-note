import React, { useEffect, useState } from "react";
import { Card, GamePlayer, GameState } from "../logic";
import PlayCard from "./PlayCard";
import ph from "./PlayerHand.module.css";

interface GameProps {
  game: GameState;
  player: GamePlayer;
  pinPos: number[];
}

type CardRotationConfig = {
  [key: number]: string;
};

const cardRotationConfig: CardRotationConfig = {
  0: "-5deg",
  1: "5deg",
  2: "5deg",
};

const Game = ({ game, player, pinPos }: GameProps) => {
  const dummyCard: Card = game.deck[0];
  const dummy2Card: Card = game.deck[1];
  const dummy3Card: Card = game.deck[2];

  return (
    <div className={`${ph.playerHandContainer}`}>
      <div className={`${ph.flexCenterPlayerHand}`}>
        <div
          style={{
            display: "grid",
            gap: "0.5rem",
            gridTemplateColumns: `${
              player.playerHand.length === 2
                ? "repeat(4, 25px)"
                : "repeat(6, 25px)"
            }`,
          }}
        >
          {player.playerHand.map((cardVal, idx) => {
            return (
              <PlayCard
                key={`${cardVal}- ${idx}`}
                card={cardVal}
                player={player}
                cardRotation={cardRotationConfig[idx]}
                left={"0px"}
                top={"0px"}
                pinPos={pinPos}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Game;

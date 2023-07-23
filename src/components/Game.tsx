import React, { useEffect, useState } from "react";
import { Card, GamePlayer, GameState } from "../logic";
import PlayCard from "./PlayCard";
import ph from "./PlayerHand.module.css";

interface GameProps {
  game: GameState;
  player: GamePlayer;
  pinPos: number[];
}

const Game = ({ game, player, pinPos }: GameProps) => {
  console.log("player", player);
  const dummyCard: Card = game.deck[0];
  const dummy2Card: Card = game.deck[1];
  const dummy3Card: Card = game.deck[2];

  return (
    <div className={`${ph.playerHandContainer}`}>
      <div className={`${ph.flexCenterPlayerHand}`}>
        <div className={`${ph.flexPlayerHand}`}>
          {[0, 1, 2].map((cardVal, idx) => {
            return (
              <PlayCard
                card={dummyCard}
                player={player}
                cardRotation={`${idx * 10 - 10}deg`}
                left={`${5 - 5 * idx}px`}
                top={`${idx == 1 ? -8 : 0}px`}
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

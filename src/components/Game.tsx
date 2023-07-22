import React, { useEffect, useState } from "react";
import { Card, GamePlayer, GameState } from "../logic";
import PlayCard from "./PlayCard";
import ph from "./PlayerHand.module.css";

interface GameProps {
  game: GameState;
  player: GamePlayer;
}

const Game = ({ game, player }: GameProps) => {
  console.log("player", player);
  const dummyCard: Card = game.deck[0];
  const dummy2Card: Card = game.deck[1];
  const dummy3Card: Card = game.deck[2];

  return (
    <div className={`${ph.playerHandContainer}`}>
      <div className={`${ph.flexCenterPlayerHand}`}>
        <div className={`${ph.flexPlayerHand}`}>
          <PlayCard card={dummyCard} player={player} cardRotation={"0deg"} />
          <PlayCard card={dummy2Card} player={player} cardRotation={"0deg"} />
          <PlayCard card={dummy3Card} player={player} cardRotation={"0deg"} />
        </div>
      </div>
    </div>
  );
};

export default Game;

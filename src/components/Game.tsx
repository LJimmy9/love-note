import React, { useEffect, useState } from "react";
import { Card, GamePlayer, GameState } from "../logic";
import PlayCard from "./PlayCard";
import ph from "./PlayerHand.module.css";

interface GameProps {
  game: GameState;
  player: GamePlayer;
  pinPos: number[]
}

const Game = ({ game, player , pinPos}: GameProps) => {
  console.log("player", player);
  const dummyCard: Card = game.deck[0];
  const dummy2Card: Card = game.deck[1];
  const dummy3Card: Card = game.deck[2];

  return (
    <div className={`${ph.playerHandContainer}`}>
      <div className={`${ph.flexCenterPlayerHand}`}>
        <div className={`${ph.flexPlayerHand}`}>
          <PlayCard
            card={dummyCard}
            player={player}
            cardRotation={"-20deg"}
            zIndex={"1"}
            left={"15px"}
            right={"0px"}
            top={"6.6px"}
            pinPos = {pinPos}
          />
          <PlayCard
            card={dummy2Card}
            player={player}
            cardRotation={"0deg"}
            zIndex={"2"}
            left={"0px"}
            right={"0px"}
            top={"0px"}
            pinPos = {pinPos}
          />
          <PlayCard
            card={dummy3Card}
            player={player}
            cardRotation={"20deg"}
            zIndex={"3"}
            left={"0px"}
            right={"10px"}
            top={"5.6px"}
            pinPos = {pinPos}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;

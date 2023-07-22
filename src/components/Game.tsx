import React, { useEffect, useState } from "react";
import { Card, GameState } from "../logic";
import PlayCard from "./PlayCard";

interface GameProps {
  game: GameState;
}

const Game = ({ game }: GameProps) => {
  const dummyCard: Card = game.deck[0];

  return <PlayCard card={dummyCard} />;
};

export default Game;

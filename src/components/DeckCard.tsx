import { useRef } from "react";
import { Card } from "../logic";
import d from "./DeckCard.module.css";
import { Player } from "rune-games-sdk/multiplayer";

interface DeckCardProps {
  deckCard: Card;
  player: Player;
}

function DeckCard({ deckCard, player }: DeckCardProps) {
  const cardRef = useRef(null);

  function drawCard() {
    Rune.actions.drawCard({ deckCard: deckCard, playerId: player.playerId });
  }

  return (
    <div className={d.deckCard} ref={cardRef} onClick={() => drawCard()}>
      <div className={d.backImg}>💟</div>
    </div>
  );
}

export default DeckCard;

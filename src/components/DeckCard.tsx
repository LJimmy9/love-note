import { useRef } from "react";
import { Card } from "../logic";
import d from "./DeckCard.module.css";
import { Player } from "rune-games-sdk/multiplayer";

interface DeckCardProps {
  card: Card;
  player: Player;
}

function DeckCard({ card, player }: DeckCardProps) {
  const cardRef = useRef(null);

  return (
    <div
      className={d.deckCard}
      ref={cardRef}
      onClick={() => {
        Rune.actions.drawCard({ deckCard: card, playerId: player.playerId });
        console.log("draw");
      }}
    >
      <div className={d.backImg}>💟</div>
    </div>
  );
}

export default DeckCard;

import { useEffect, useRef, useState } from "react";
import { Card } from "../logic";
import d from "./DeckCard.module.css";
import { Player } from "rune-games-sdk/multiplayer";

interface DeckCardProps {
  card: Card;
  player: Player;
}

function DeckCard({ card, player }: DeckCardProps) {
  const cardRef = useRef(null);

  const [drawCard, setDrawCard] = useState<boolean>(false);

  const handleDrawCard = () => {
    setDrawCard(true);
    setTimeout(() => {
      Rune.actions.drawCard({ deckCard: card, playerId: player.playerId });
      setDrawCard(false);
    }, 3000);
  };

  return (
    <div className={d.deckCard}>
      <div
        className={d.theCard}
        ref={cardRef}
        onClick={handleDrawCard}
        style={{ transform: drawCard ? "rotateY(180deg)" : "rotateY(0)" }}
      >
        {drawCard && (
          <div className={d.frontImageContainer}>
            <div className={d.frontImage}>
              <div>
                {card.cardNum} {card.image}
              </div>
              <div>{card.name}</div>
            </div>
          </div>
        )}
        <div className={d.backImageContainer}>
          <div className={d.backImg}>💟</div>
        </div>
      </div>
    </div>
  );
}

export default DeckCard;

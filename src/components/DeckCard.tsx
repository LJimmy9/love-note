import { useEffect, useRef, useState } from "react";
import { Card } from "../logic";
import d from "./DeckCard.module.css";
import { Player } from "rune-games-sdk/multiplayer";

interface DeckCardProps {
  card: Card;
  player: Player;
  currentTurn: string;
}

function DeckCard({ card, player, currentTurn }: DeckCardProps) {
  const cardRef = useRef(null);

  const [drawCard, setDrawCard] = useState<boolean>(false);
  let drawCardTimeout: any;

  const handleDrawCard = () => {
    // Clear the previous timeout (if any) to prevent multiple timeouts running simultaneously
    clearTimeout(drawCardTimeout);

    // Set drawCard to true to show that the card is being drawn
    setDrawCard(true);

    // Set a new timeout to automatically set drawCard back to false after 2000 milliseconds (2 seconds)
    drawCardTimeout = setTimeout(() => {
      Rune.actions.drawCard({ deckCard: card, playerId: player.playerId });
      setDrawCard(false);
    }, 2000);
  };

  return (
    <div className={d.deckCard}>
      <div
        className={d.theCard}
        ref={cardRef}
        // onClick={handleDrawCard}
        {...(currentTurn === player.playerId && { onClick: handleDrawCard })}
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

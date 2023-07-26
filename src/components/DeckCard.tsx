import { useRef, useState } from "react";
import { Card } from "../logic";
import d from "./DeckCard.module.css";
import { $gamePhase, $runePlayer } from "../state/game";
import { useAtomValue } from "jotai";

interface DeckCardProps {
  card: Card;
  currentTurn: string;
}

function DeckCard({ card, currentTurn }: DeckCardProps) {
  const cardRef = useRef(null);

  const [drawCard, setDrawCard] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  const player = useAtomValue($runePlayer);
  const gamePhase = useAtomValue($gamePhase);
  const handleDrawCard = () => {
    setDrawCard(true);
    setClicked(true);
  };

  return (
    <div className={d.deckCard}>
      <div
        className={`${d.theCard}  ${drawCard && d.drawCardAnim}`}
        ref={cardRef}
        onAnimationEnd={() =>
          Rune.actions.drawCard({
            deckCard: card,
            playerIdToUpdate: player.playerId,
          })
        }
        // onClick={handleDrawCard}
        {...(currentTurn === player.playerId &&
          gamePhase === "Draw" &&
          !clicked && { onClick: handleDrawCard })}
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

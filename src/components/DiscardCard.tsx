import { Card } from "../logic";
import d from "./DiscardCard.module.scss";
import p from "./PlayCard.module.scss";

interface DiscardCardProps {
  card: Card;
}

function DeckCard({ card }: DiscardCardProps) {
  return (
    <div className={`${d.discardContentContainer} ${d.enterAnim}`}>
      <div className={d.discardPile}>
        <div className={d.cardDiscardHeader}>
          <div className={d.cardNum}>{card.cardNum}</div>
          <div className={`${d.cardDiscardImage}`}>{card.image}</div>
        </div>
        <div className={d.cardName}>{card.name}</div>
      </div>
    </div>
  );
}

export default DeckCard;

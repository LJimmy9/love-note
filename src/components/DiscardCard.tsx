import { Card } from "../logic";
import d from "./DiscardCard.module.css";
import p from "./PlayCard.module.css";

interface DiscardCardProps {
  card: Card;
}

function DeckCard({ card }: DiscardCardProps) {
  return (
    <div className={d.discardCard}>
      <div className={p.cardHeader}>
        <div className={p.cardNum}>{card.cardNum}</div>
      </div>
      <div className={p.cardImage}>{card.image}</div>
      <div className={p.cardName}>{card.name}</div>
    </div>
  );
}

export default DeckCard;

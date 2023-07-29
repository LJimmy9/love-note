import { Card } from "../logic";
import d from "./DiscardCard.module.css";
import p from "./PlayCard.module.scss";

interface DiscardCardProps {
  card: Card;
}

function DeckCard({ card }: DiscardCardProps) {
  return (
    <div className={`${d.discardContainer} ${d.enterAnim}`}>
      <div className={d.discardPile}>
        <div className={p.cardDiscardHeader}>
          <div className={d.cardNum}>{card.cardNum}</div>
          <div className={`${p.cardDiscardImage}`}>{card.image}</div>
        </div>
        <div className={p.cardName} style={{ fontSize: "8px" }}>
          {card.name}
        </div>
      </div>
    </div>
  );
}

export default DeckCard;

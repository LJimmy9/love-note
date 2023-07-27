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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setDrawCard] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  const player = useAtomValue($runePlayer);
  const gamePhase = useAtomValue($gamePhase);
  const handleDrawCard = () => {
    setDrawCard(true);
    setClicked(true);
    Rune.actions.drawCard({
      deckCard: card,
      playerIdToUpdate: player.playerId,
    });
  };

  return (
    <div
      ref={cardRef}
      // onClick={handleDrawCard}
      {...(currentTurn === player.playerId &&
        gamePhase === "Draw" &&
        !clicked && { onClick: handleDrawCard })}
    >
      <div className={d.backImageContainer}>
        <div className={d.backImg}></div>
      </div>
    </div>
  );
}

export default DeckCard;

import { useRef, useState } from "react";
import { Card } from "../logic";
import d from "./DeckCard.module.scss";
import { $game, $gamePhase, $runePlayer } from "../state/game";
import { useAtomValue } from "jotai";
import cardSlide5 from "../assets/cardSlide5.ogg";

interface DeckCardProps {
  card: Card;
  currentTurn: string;
}

export function playSound(sfx: any) {
  const audio = new Audio(sfx);
  audio.volume = 0.35;
  audio.play();
}

function DeckCard({ card, currentTurn }: DeckCardProps) {
  const cardRef = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setDrawCard] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  const player = useAtomValue($runePlayer);
  const gamePhase = useAtomValue($gamePhase);
  const game = useAtomValue($game);

  const handleDrawCard = () => {
    setDrawCard(true);
    setClicked(true);
    playSound(cardSlide5);
    Rune.actions.drawCard({
      deckCard: card,
      playerIdToUpdate: player.playerId,
    });

    if (card.autoPlay) {
      Rune.actions.playCard({
        playCard: card,
        playerIdToUpdate: player.playerId,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${d.deckCard}`}
      // onClick={handleDrawCard}
      {...(currentTurn === player.playerId &&
        gamePhase === "Draw" &&
        !clicked && { onClick: handleDrawCard })}
    >
      <div className={d.backImageContainer}>
        <div className={d.backImg}>
          <p>Direction: {game?.gameState.direction == "left" ? "⬅️" : "➡️"}</p>
          <p>
            Priority: {game?.gameState.priority == "highest" ? "⬆️" : "⬇️"}{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeckCard;

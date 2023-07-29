import { useRef, useState, useEffect } from "react";
import { Card, GamePlayer, GameState } from "../logic";
import s from "./PlayCard.module.scss";
import LoveNoteCard from "./LoveNoteCard";
import { $runePlayer } from "../state/game";
import { useAtomValue } from "jotai";
import { handleResize, Position } from "../utils/Resize";
import Meddle from "./CardAction/Meddle";

export interface CardProps {
  game: GameState;
  card: Card;
  player: GamePlayer;
  cardRotation: string;
  pinPos: number[];
  clickable: boolean;
  currentPlayer: boolean;
}

export interface Size {
  width: number;
  height: number;
}

interface CardStyles {
  [key: string]: string;
}

function PlayCard({
  game,
  card,
  cardRotation,
  player,
  pinPos,
  clickable,
  currentPlayer,
}: CardProps) {
  const defaultStyle = {
    position: "relative",
    rotation: cardRotation,
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [_windowSize, setWindowSize] = useState<Size>({ width: 0, height: 0 });
  const [cardStyles, setCardStyles] = useState<CardStyles>(defaultStyle);
  const [_, setTarget] = useState<number[]>([]);
  const [dealt, setDealt] = useState<boolean>(false);

  const currPlayer = useAtomValue($runePlayer);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    handleResize(
      cardRef.current,
      (pos: Position) => setPos(pos),
      (x, y) => setWindowSize({ width: x, height: y })
    );
    window.addEventListener("resize", () => {
      handleResize(
        el,
        (pos: Position) => setPos(pos),
        (x, y) => setWindowSize({ width: x, height: y })
      );
    });

    setCardStyles({
      ...cardStyles,
    });

    return () => {
      window.removeEventListener("resize", () => {
        handleResize(
          el,
          (pos: Position) => setPos(pos),
          (x, y) => setWindowSize({ width: x, height: y })
        );
      });
    };
  }, [cardRef.current]);

  function handleClick() {
    setIsOpen(!isOpen);

    if (isOpen) {
      setCardStyles({ ...defaultStyle });
    } else {
      const targetX = pinPos[0] - pos.x;
      const targetY = pinPos[1] - pos.y;
      setTarget([Math.floor(targetX), Math.floor(targetY)]);
    }
  }

  function getCardDescription() {
    switch (card.name) {
      case "Love Note":
        return (
          <LoveNoteCard
            card={card}
            player={player}
            loveNotes={game.loveNotes}
          />
        );
      case "Meddle":
        return (
          <Meddle card={card} player={player} loveNotes={game.loveNotes} />
        );
      default:
        return <>{card.description}</>;
    }
  }

  const description = getCardDescription();

  // adjust css properties
  const animStr = currentPlayer ? s.drawCardAnim : s.sideDrawAnim;
  const roleRestriction = card.restrictionToRole
    ? card.restrictionToRole === player.playerIdentity.role
    : true;

  const cardFront = (
    <div className={`${s.playerCardFront}`}>
      <div
        className={`${s.playerCard}`}
        style={{
          width: `${isOpen ? "28ch" : "8ch"}`,
          height: `${isOpen ? "38ch" : "16ch"}`,
          transform: `translate(${isOpen ? "-25%" : "0"}, ${
            isOpen ? "-130" : "0"
          }%)`,
        }}
      >
        {/* Header for the card has number and card name */}
        {clickable && (
          <div className={s.cardHeader}>
            <div className={s.cardNum}>{card.cardNum}</div>
            {card.canPlay && isOpen && roleRestriction && (
              <div
                className={s.playCardBtn}
                onClick={() => {
                  Rune.actions.playCard({
                    playCard: card,
                    playerIdToUpdate: currPlayer.playerId,
                  });
                }}
              >
                ▶️
              </div>
            )}
          </div>
        )}

        {/* Body image */}
        {clickable && (
          <div className={s.playCardDetail}>
            <div className={s.cardImage}>{card.image}</div>
            <div className={s.cardName}>{card.name}</div>
          </div>
        )}
        {/* Footer description */}
        <div className={`${s.cardbody} ${isOpen ? s.showText : s.hideText}`}>
          {description}
          {/* <LoveNoteCard card={card} player={player} /> */}
        </div>
      </div>
    </div>
  );

  const cardBack = (
    <div className={`${s.playerCardBack}`}>
      <div className={`${s.backContent} `}></div>
    </div>
  );

  return (
    <div
      className={`${s.playerCardContainer} ${!dealt && animStr} ${
        isOpen ? s.expand : s.default
      }`}
      style={{
        rotate: `${isOpen ? "0deg" : dealt && cardRotation}`,
      }}
      onAnimationEnd={() => {
        setDealt(true);
        Rune.actions.resolveProcessing();
      }}
      onClick={() => {
        if (clickable) handleClick();
      }}
      ref={cardRef}
    >
      {cardFront}
      {cardBack}
    </div>
  );
}

export default PlayCard;

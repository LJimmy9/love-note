import { useRef, useState, useEffect } from "react";
import { Card, GamePlayer, GameState } from "../logic";
import s from "./PlayCard.module.css";
import LoveNoteCard from "./LoveNoteCard";
import { $runePlayer } from "../state/game";
import { useAtomValue } from "jotai";

export interface CardProps {
  game: GameState;
  card: Card;
  player: GamePlayer;
  //position: string;  --hard coded atm to be relative
  cardRotation: string;
  pinPos: number[];
  clickable: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

interface CardStyles {
  [key: string]: string;
}

function PlayCard({ game, card, cardRotation, player, pinPos, clickable }: CardProps) {
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

  function handleResize(
    el: HTMLDivElement,
    updatePosCb: (pos: Position) => void,
    updateWindowSizeCb: (windowX: number, windowY: number) => void
  ) {
    const rect = el.getBoundingClientRect();
    const x = rect.left;
    const y = rect.top;
    updatePosCb({ x: x, y: y });

    const windowX = window.innerWidth;
    const windowY = window.innerHeight;

    updateWindowSizeCb(windowX, windowY);
  }

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

  function handleClick() 
  {
    setIsOpen(!isOpen);

    if (isOpen) {
      setCardStyles({ ...defaultStyle });
    } else {
      const targetX = pinPos[0] - pos.x;
      const targetY = pinPos[1] - pos.y;
      setTarget([Math.floor(targetX), Math.floor(targetY)]);
    }
  }

  const description =
    card.name === "Love Note" ? (
      <LoveNoteCard card={card} player={player} loveNotes={game.loveNotes} />
    ) : (
      <>{card.description}</>
    );

  return (
    <div
      className={`${s.playerCardContainer} ${!dealt && s.drawCardAnim} ${
        isOpen ? s.expand : s.default
      }`}
      style={{
        rotate: `${isOpen ? "0deg" : dealt && cardRotation}`,
        // transform: `translate(-50px, -50px)`,
      }}
      onAnimationEnd={() => setDealt(true)}
      onClick={() => { if (clickable) handleClick() }}
      ref={cardRef}
    >
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
            {card.canPlay && isOpen && (
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
            <>
              <div className={s.cardImage}>{card.image}</div>
              <div className={s.cardName}>{card.name}</div>
            </>
          )}
          {/* Footer description */}
          <div className={`${s.cardbody} ${isOpen ? s.showText : s.hideText}`}>
            {description}
            {/* <LoveNoteCard card={card} player={player} /> */}
          </div>
        </div>
      </div>

      <div className={`${s.playerCardBack}`}>
        <div className={`${s.backContent} `}></div>
      </div>
    </div>
  );
}

export default PlayCard;

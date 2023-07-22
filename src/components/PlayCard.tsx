import { useRef, useState, useEffect } from "react";
import { Card, GamePlayer } from "../logic";
import { motion } from "framer-motion";
import s from "./PlayCard.module.css";

export interface CardProps {
  card: Card;
  player: GamePlayer;
  cardRotation: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

function PlayCard({ card, player, cardRotation }: CardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState<Size>({ width: 0, height: 0 });

  const cardRef = useRef(null);

  function handleResize(
    el: HTMLDivElement,
    updatePosCb: (pos: Position) => void,
    updateWindowSizeCb: (windowX: number, windowY: number) => void
  ) {
    const x = el.offsetLeft;
    const y = el.offsetTop;
    updatePosCb({ x: x, y: y });

    const windowX = window.innerWidth;
    const windowY = window.innerHeight;

    updateWindowSizeCb(windowX, windowY);
  }

  useEffect(() => {
    if (!cardRef.current) return;
    handleResize(
      cardRef.current,
      (pos: Position) => setPos(pos),
      (x, y) => setWindowSize({ width: x, height: y })
    );
    window.addEventListener("resize", () =>
      handleResize(
        cardRef.current!,
        (pos: Position) => setPos(pos),
        (x, y) => setWindowSize({ width: x, height: y })
      )
    );
    return () => {
      window.removeEventListener("resize", () => {
        handleResize(
          cardRef.current!,
          (pos: Position) => setPos(pos),
          (x, y) => setWindowSize({ width: x, height: y })
        );
      });
    };
  }, [cardRef.current]);

  useEffect(() => {
    console.log("pc pos", pos);

    console.log("window size", windowSize);
  }, [pos, windowSize]);

  return (
    <div
      ref={cardRef}
      className={`${s.playerCard} ${isOpen ? s.expand : s.default}`}
      onClick={() => setIsOpen(!isOpen)}
      style={{ rotate: !isOpen ? cardRotation : "" }}
      // style={{
      //   transform: `translate(${windowSize.width - pos.x}px, ${
      //     windowSize.height - pos.y
      //   }px)`,
      // }}
    >
      {/* Header for the card has number and card name */}
      <div className={s.cardHeader}>
        <div className={s.cardNum}>{card.cardNum}</div>
      </div>

      {/* Body image */}
      <div className={s.cardImage}>{card.image}</div>
      <div className={s.cardName}>{card.name}</div>

      {/* Footer description */}
      <div className={`${s.cardbody} ${isOpen ? s.showText : s.hideText}`}>
        {card.description}
      </div>
    </div>
  );
}

export default PlayCard;

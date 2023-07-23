import { useRef, useState, useEffect } from "react";
import { Card, GamePlayer } from "../logic";
import { motion } from "framer-motion";
import s from "./PlayCard.module.css";

export interface CardProps {
  card: Card;
  player: GamePlayer;
  cardRotation: string;
  //position: string;  --hard coded atm to be relative
  left: string;
  top: string;
  pinPos: number[];
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

function PlayCard({
  card,
  player,
  cardRotation,
  left,
  top,
  pinPos,
}: CardProps) {
  const defaultStyle = {
    position: "relative",
    rotate: cardRotation,
    left: left,
    top: top,
    transform: `translate(${0}px, ${0}px)`,
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState<Size>({ width: 0, height: 0 });
  const [cardStyles, setCardStyles] = useState<CardStyles>(defaultStyle);

  const cardRef = useRef(null);

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

    setCardStyles({
      ...cardStyles,
      rotate: cardRotation,
      left: left,
      top: top,
      transform: `translate(${0}px, ${0}px)`,
    });

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

  const test = (
    <div className="card">
      <header>
        <span className="card-title">Title Text</span>
      </header>
      <p className="card-text">some text</p>
    </div>
  );

  function handleClick() {
    setIsOpen(!isOpen);

    if (isOpen) {
      setCardStyles({ ...defaultStyle });
    } else {
      const targetX = pinPos[0] - pos.x;
      const targetY = pinPos[1] - pos.y;
      setCardStyles({
        rotate: "",
        position: "relative",
        left: "-1",
        top: "8",
        width: "20ch",
        height: "40ch",
        transformOrigin: "bottom right",
        transform: `translate(${targetX}px, ${targetY}px)`,
      });
    }
  }

  return (
    <div
      ref={cardRef}
      className={`${s.playerCard} ${isOpen ? s.expand : s.default}`}
      onClick={() => handleClick()}
      style={{ ...cardStyles }}
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

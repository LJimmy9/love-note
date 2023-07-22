import { useState } from "react";
import { Card } from "../logic";
import { motion } from "framer-motion";
import s from "./PlayCard.module.css";

interface CardProps {
  card: Card;
}

function PlayCard({ card }: CardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <motion.div
      transition={{ layout: { duration: 0.5, type: "spring" } }}
      layout
      onClick={() => setIsOpen(!isOpen)}
      className={s.playerCard}
      style={{
        borderRadius: "1rem",
        boxShadow: "0px 10px 30px 0px rgba(0, 0, 0, 0.5)",
      }}
    >
      <motion.h2 className={s.cardHeader} layout="position">
        {card.cardNum}
        {card.name}
        {card.image}
      </motion.h2>
      {isOpen && (
        <div className={s.cardBody}>
          <p>{card.description}</p>
          <button
            onClick={() => {
              console.log("clicked");
            }}
          >
            Play
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default PlayCard;

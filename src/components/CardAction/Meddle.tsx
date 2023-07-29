import { useState } from "react";
import { Card, GamePlayer, Note } from "../../logic";
import LoveNoteAction from "./LoveNoteAction";

interface LoveNoteCardProps {
  card: Card;
  player: GamePlayer;
  loveNotes: Array<Note>;
}

function LoveNoteCard({ card, player, loveNotes }: LoveNoteCardProps) {
  const [showNotes, setShowNotes] = useState<boolean>(false);

  const description = !showNotes ? <div>{card.description}</div> : null;
  return (
    <div>
      {description}
      <LoveNoteAction
        player={player}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
        loveNotes={loveNotes}
      />
    </div>
  );
}

export default LoveNoteCard;

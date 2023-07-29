import { useState } from "react";
import { Card, GamePlayer, Note } from "../logic";
import LoveNoteAction from "./CardAction/LoveNoteAction";

interface LoveNoteCardProps {
  card: Card;
  player: GamePlayer;
  loveNotes: Array<Note>;
}

function LoveNoteCard({ card, player, loveNotes }: LoveNoteCardProps) {
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const idCardRole = player.playerIdentity.role;

  function performAction(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    prompt: string
  ) {
    e.stopPropagation();

    switch (idCardRole) {
      case "Lover":
        Rune.actions.updateLoveNote({ action: "add", prompt: prompt });
        break;
      case "Tattle Tale":
        Rune.actions.updateLoveNote({ action: "remove", prompt: prompt });
        break;
      default:
      // console.log("view only");
    }
  }

  const description = showNotes ? (
    <div>
      {loveNotes.map((note: Note) => {
        return (
          <div
            key={`note-${note.id}`}
            style={{ margin: "5px 0" }}
            onClick={(e) => performAction(e, note.text)}
          >
            {note.text}
          </div>
        );
      })}
    </div>
  ) : (
    <>{card.description}</>
  );

  return (
    <div>
      <div>{description}</div>
      <LoveNoteAction
        player={player}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
      />
    </div>
  );
}

export default LoveNoteCard;

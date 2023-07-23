import { useState } from "react";
import { CardProps } from "./PlayCard";
import { Note } from "../logic";

function LoveNoteCard({ card, player }: CardProps) {
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const prompts = [];
  const idCardName = player.playerIdentity.name;
  // Tattle Tales can remove notes, lovers can add notes, and friends can only view notes
  const actionTxt =
    idCardName === "Lover"
      ? "Add Note"
      : idCardName === "Tattle Tale"
      ? "Remove Note"
      : "View Notes";

  function performAction() {
    setShowNotes(false);
    switch (idCardName) {
      case "Lover":
        Rune.actions.updateLoveNote({ action: "add" });
        break;
      case "Tattle Tale":
        Rune.actions.updateLoveNote({ action: "remove" });
        break;
      default:
        console.log("view only");
    }
  }

  const notes = Rune.actions.getLoveNotes();
  return (
    <div>
      <div>{card.description}</div>
      <div onClick={() => performAction()}>{actionTxt}</div>
      <div onClick={() => setShowNotes(!showNotes)}>Notes</div>
      {showNotes &&
        notes.map((note: Note) => {
          return <div>{note.text}</div>;
        })}
    </div>
  );
}

export default LoveNoteCard;

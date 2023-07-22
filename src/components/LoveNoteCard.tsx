import { useState } from "react";
import { CardProps } from "./PlayCard";

function LoveNoteCard({ card, player }: CardProps) {
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const idCardName = player.playerIdentity.name;
  // Tattle Tales can remove notes, lovers can add notes, and friends can only view notes
  const actionTxt =
    idCardName === "Lover"
      ? "Add Note"
      : idCardName === "Tattle Tale"
      ? "Remove Note"
      : "View Notes";

  function addNote() {
    // add a note to the love note
  }

  function deleteNote() {
    // remove a note to the love note
  }

  function performAction() {
    setShowNotes(false);
    switch (idCardName) {
      case "Lover":
        addNote();
        break;
      case "Tattle Tale":
        deleteNote();
        break;
      default:
        console.log("view only");
    }
  }
  return (
    <div>
      <div>{card.description}</div>
      <div onClick={() => performAction()}>{actionTxt}</div>
      <div onClick={() => setShowNotes(!showNotes)}>Notes</div>
    </div>
  );
}

export default LoveNoteCard;

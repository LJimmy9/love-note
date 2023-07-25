import { useState } from "react";
import { Card, GamePlayer, Note } from "../logic";

interface LoveNoteCardProps {
  card: Card;
  player: GamePlayer;
  loveNotes: Array<Note>;
}

function LoveNoteCard({ card, player, loveNotes }: LoveNoteCardProps) {
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const idCardRole = player.playerIdentity.role;
  const notePrompts = ["💝", "😚", "😉", "💕"];
  // Tattle Tales can remove notes, lovers can add notes, and friends can only view notes
  const actionTxt =
    idCardRole === "Lover"
      ? "Add Note"
      : idCardRole === "Tattle Tale"
      ? "Remove Note"
      : "View Notes";

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

  function viewNotes(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    setShowNotes(!showNotes);
  }

  function getNotesDisplay() {
    switch (idCardRole) {
      case "Lover":
        return (
          <>
            <div style={{ marginBottom: "5px" }}>click on a note to add</div>
            <div>
              {notePrompts.map((prompt, idx) => {
                return (
                  <span
                    key={`prompt-${idx}`}
                    style={{
                      margin: "0 5px",
                      padding: "2px",
                      border: "1px solid #FDFD96",
                      borderRadius: "1rem",
                      backgroundColor: "#FDFD96",
                    }}
                    onClick={(e) => performAction(e, prompt)}
                  >
                    {prompt}
                  </span>
                );
              })}
            </div>
          </>
        );
      case "Tattle Tale":
        return (
          <>
            <div style={{ marginBottom: "5px" }}>click on a note to remove</div>
          </>
        );
        break;
      default:
        return <></>;
    }
  }

  const loveNotesDisplay = showNotes ? getNotesDisplay() : null;

  const description = showNotes ? (
    <div>
      {loveNotes.map((note: Note) => {
        return (
          <div key={`note-${note.id}`} style={{ margin: "5px 0" }}>
            {note.text}
          </div>
        );
      })}
    </div>
  ) : (
    <>{card.description}</>
  );

  const closeBtn = showNotes ? (
    <div
      onClick={(e) => {
        viewNotes(e);
      }}
      style={{ fontSize: "20px", marginTop: "15px" }}
    >
      🔙
    </div>
  ) : null;

  return (
    <div>
      <div>{description}</div>
      <div
        style={{ cursor: "pointer", marginTop: "15px" }}
        onClick={(e) => viewNotes(e)}
      >
        {loveNotesDisplay}
        {closeBtn}
        {!showNotes && (
          <>
            {actionTxt}
            <div>😍</div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoveNoteCard;

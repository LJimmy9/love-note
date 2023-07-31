import { Dispatch, SetStateAction } from "react";
import { GamePlayer, Note } from "../../logic";
import { useAtomValue } from "jotai";
import { $runePlayer } from "../../state/game";

interface LoveNoteActionProps {
  player: GamePlayer;
  showNotes: boolean;
  setShowNotes: Dispatch<SetStateAction<boolean>>;
  loveNotes: Array<Note>;
  cardNum: number;
}

export default function LoveNoteAction({
  player,
  showNotes,
  setShowNotes,
  loveNotes,
  cardNum,
}: LoveNoteActionProps) {
  const currPlayer = useAtomValue($runePlayer);
  const idCardRole = player.playerIdentity.role;
  const notePrompts = ["💝", "😚", "💙", "😉", "💗", "😘"];
  const actionTxt = "Open Love Note";

  function performAction(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    prompt: string
  ) {
    e.stopPropagation();

    switch (idCardRole) {
      case "Lover":
        Rune.actions.updateLoveNote({
          action: "add",
          prompt: prompt,
          requestPlayerId: currPlayer.playerId,
          cardNum: cardNum,
        });
        break;
      case "Tattle Tale":
        Rune.actions.updateLoveNote({
          action: "remove",
          prompt: prompt,
          requestPlayerId: currPlayer.playerId,
          cardNum: cardNum,
        });
        break;
      case "Friend":
        Rune.actions.updateLoveNote({
          action: "add",
          prompt: prompt,
          requestPlayerId: currPlayer.playerId,
          cardNum: cardNum,
        });
        break;
      default:
        break;
    }
  }

  function viewNotes(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    setShowNotes(!showNotes);
  }

  const addNotePrompts = (
    <>
      <div style={{ margin: "10px 0" }}>click to add</div>
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

  function getNotesDisplay() {
    switch (idCardRole) {
      case "Lover":
        return <>{addNotePrompts}</>;
      case "Tattle Tale":
        return (
          <>
            <div style={{ margin: "10px 0px" }}>click a note to remove</div>
          </>
        );
        break;
      case "Friend":
        if (cardNum === 6) {
          return <>{addNotePrompts}</>;
        } else {
          return <></>;
        }
      default:
        return <></>;
    }
  }

  const loveNotesDisplay = showNotes ? (
    <div>
      {loveNotes.map((note: Note) => {
        return (
          <span
            key={`note-${note.id}`}
            style={{ margin: "5px" }}
            onClick={(e) => performAction(e, note.text)}
          >
            {note.text}
          </span>
        );
      })}
      {getNotesDisplay()}
    </div>
  ) : null;

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
  );
}

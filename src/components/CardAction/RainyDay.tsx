import React, { useEffect } from "react";
import { $game } from "../../state/game";
import { useAtomValue } from "jotai";
import { Note } from "../../logic";
import ln from "./LoveNote.module.css";

interface RainyDayProps {
  loveNotes: Array<Note>;
}

const RainyDay = ({ loveNotes }: RainyDayProps) => {
  const game = useAtomValue($game);
  //   const loveNotes = game?.gameState.loveNotes;

  useEffect(() => {
    console.log("rainy day loveNotes", loveNotes);
  }, [loveNotes]);

  return (
    <div className={ln.loveNoteContainer}>
      <div>{"💌"}</div>
      <div>Love Note</div>
      <div>
        {loveNotes.map((note) => {
          return (
            <div key={`note-${note.id}`} style={{ margin: "5px 0" }}>
              {note.text}
            </div>
          );
        })}
      </div>
      <div className={ln.doneBtnContainer}>
        <div
          className={ln.doneBtn}
          onClick={() => {
            Rune.actions.updateCurrentTurn();
          }}
        >
          👌
        </div>
      </div>
    </div>
  );

  //   return <div>RainyDay</div>;
};

export default RainyDay;

import React, { useEffect, useState } from "react";
import { $game, $runePlayer } from "../../state/game";
import { useAtomValue } from "jotai";
import { Note } from "../../logic";
import ln from "./LoveNote.module.css";

interface RainyDayProps {
  loveNotes: Array<Note>;
}

const RainyDay = ({ loveNotes }: RainyDayProps) => {
  const game = useAtomValue($game);
  const player = useAtomValue($runePlayer);
  // const [showLetter, setShowLetter] = useState<boolean>(false);
  const [fadeOutLetter, setFadeOutLetter] = useState<boolean>(false);
  const [showActionText, setShowActionText] = useState<boolean>(false);

  return (
    <div className={ln.loveNoteActionContainer}>
      <div
        className={`${ln.loveNoteContainer}`}
        onAnimationEnd={() => setFadeOutLetter(true)}
      >
        <div className={ln.loveNoteContent}>
          <div>{"💌"}</div>
          <div>Love Note</div>
          <div>
            {loveNotes.map((note, idx) => {
              return (
                <div
                  key={`note-${note.id}`}
                  style={{ margin: "5px 0" }}
                  className={`${
                    idx === loveNotes.length - 1 &&
                    fadeOutLetter &&
                    ln.fadeOutAnimation
                  }`}
                  onAnimationEnd={() => setShowActionText(true)}
                >
                  <p>{note.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ fontSize: "10px", lineHeight: "15px" }}>
        {showActionText && (
          <p>
            {game?.gameState.players[player.playerId].playerIdentity.role
              ? "Oh no! The rain washed off some parts of the note! :( "
              : "Yes! The rain washed off some parts of the note! >:) "}
          </p>
        )}
      </div>
      {/* <div className={ln.doneBtnContainer}>
        <div
          className={ln.doneBtn}
          onClick={() => {
            Rune.actions.updateCurrentTurn();
          }}
        >
          👌
        </div>
      </div> */}
    </div>
  );

  //   return <div>RainyDay</div>;
};

export default RainyDay;

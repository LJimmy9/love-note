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
  const [fadeOutLetter, setFadeOutLetter] = useState<boolean>(false);
  const [showActionText, setShowActionText] = useState<boolean>(false);
  const [endTurn, setEndTurn] = useState<boolean>(false);

  useEffect(() => {
    if (endTurn) Rune.actions.updateCurrentTurn();
  }, [endTurn]);

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
                  style={{ margin: "2vh 0" }}
                  className={`${ln.text} ${
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
      {showActionText && (
        <div
          style={{ fontSize: "10px", lineHeight: "15px" }}
          className={ln.fadeInAnimation}
          onAnimationEnd={() => {
            const removeNote = loveNotes[loveNotes.length - 1];
            Rune.actions.updateLoveNote({
              action: "remove",
              prompt: removeNote.text,
            });
            setEndTurn(true);
          }}
        >
          <p>
            {game?.gameState.players[player.playerId].playerIdentity.role ===
            "Tattle Tale"
              ? "Yes! The rain washed off some parts of the letter! >:) "
              : "Oh no! The rain washed off some parts of the letter! :( "}
          </p>
        </div>
      )}
    </div>
  );

  //   return <div>RainyDay</div>;
};

export default RainyDay;

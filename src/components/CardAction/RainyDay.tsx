import { useState } from "react";
import { $game, $runePlayer, $gameState } from "../../state/game";
import { useAtomValue } from "jotai";
import ln from "./LoveNote.module.css";
import rain from "../../assets/rain.gif";

const RainyDay = () => {
  const game = useAtomValue($game);
  const gameState = useAtomValue($gameState);
  const player = useAtomValue($runePlayer);
  const [fadeOutLetter, setFadeOutLetter] = useState<boolean>(false);
  const [showActionText, setShowActionText] = useState<boolean>(false);

  return (
    <div className={ln.loveNoteActionContainer}>
      <img
        style={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
        }}
        src={rain}
      />
      <div style={{ fontSize: "12px" }}>{`${
        game?.yourPlayerId === player.playerId
          ? "You"
          : `${game?.players[gameState.currentTurn].displayName}`
      } drew Rainy Day!`}</div>
      <div
        className={`${ln.loveNoteContainer}`}
        onAnimationEnd={() => setFadeOutLetter(true)}
      >
        <div className={ln.loveNoteContent}>
          <div>{"💌"}</div>
          <div>Love Note</div>
          <div>
            {gameState.loveNotes.map((note, idx) => {
              return (
                <div
                  key={`note-${note.id}`}
                  style={{ margin: "2vh 0" }}
                  className={`${ln.text} ${
                    idx === gameState.loveNotes.length - 1 &&
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
            const removeNote =
              gameState.loveNotes[gameState.loveNotes.length - 1];
            Rune.actions.updateLoveNote({
              action: "remove",
              prompt: removeNote.text,
            });
            Rune.actions.updateCurrentTurn();
          }}
        >
          <p style={{ fontSize: "12px" }}>
            {game?.gameState.players[player.playerId].playerIdentity.role ===
            "Tattle Tale"
              ? "Yes! The rain washed off some parts of the letter! >:) "
              : "Oh no! The rain washed off some parts of the letter! :( "}
          </p>
        </div>
      )}
    </div>
  );
};

export default RainyDay;

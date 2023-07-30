import { useAtomValue } from "jotai";
import { $gameState } from "../../state/game";
import { TattleProps } from "../CardAction/Tattle";
import { useEffect, useState } from "react";
import { PlayerId } from "rune-games-sdk/multiplayer";

import a from "./AbsentSideEffect.module.css";
import lw from "./LoversWinSideEffect.module.css";

function LoversWinSideEffect({ players }: TattleProps) {
  const gameState = useAtomValue($gameState);
  const [showText, setShowText] = useState<boolean>(false);
  const [showGoodGame, setShowGoodGame] = useState<boolean>(false);
  const [loverSun, setLoverSun] = useState<PlayerId>();
  const [loverMoon, setLoverMoon] = useState<PlayerId>();
  const [friend, setFriend] = useState<PlayerId>();

  useEffect(() => {
    const allPlayers = Object.keys(gameState.players);
    setLoverSun(
      allPlayers.find(
        (playerId) =>
          gameState.players[playerId].playerIdentity.name === "Lover Sun"
      )
    );
    setLoverMoon(
      allPlayers.find(
        (playerId) =>
          gameState.players[playerId].playerIdentity.name === "Lover Moon"
      )
    );
    setFriend(
      allPlayers.find(
        (playerId) =>
          gameState.players[playerId].playerIdentity.name === "Nebula"
      )
    );
  }, []);

  return (
    loverSun &&
    loverMoon &&
    friend && (
      <>
        <div
          className={`${lw.info} ${lw.fadeIn}`}
          onAnimationEnd={() => setShowText(true)}
        >
          {`${players[loverSun].displayName} (Lover Sun) and ${players[loverMoon].displayName} (Lover Moon) has 
          successfully completed their Love Note with the help of ${players[friend].displayName}! Here is their note...`}
        </div>
        {showText && (
          <div
            className={a.fadeIn}
            onAnimationEnd={() => setShowGoodGame(true)}
          >
            <div className={lw.loveNote}>
              <div className={lw.noteEmoji}>💌</div>
              {gameState.loveNotes.map((note) => {
                return (
                  <div key={`win-${note.id}`} className={lw.note}>
                    {note.text}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {showGoodGame && (
          <div
            className={`${a.afterText} ${a.fadeIn}`}
            onAnimationEnd={() => Rune.actions.handleLoversWin()}
          >
            Good Game 💘
          </div>
        )}
      </>
    )
  );
}

export default LoversWinSideEffect;

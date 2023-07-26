import React, { useEffect, useState } from "react";
// import { GameState } from "../../logic";
import { useAtomValue } from "jotai";
import { $game, $runePlayer } from "../../state/game";
import ng from "./NosyGlance.module.css";
import rc from "../ResolveCard.module.css";

interface NosyGlanceProps {
  glancePlayer: string;
  setGlancePlayer: React.Dispatch<React.SetStateAction<string>>;
}

const NosyGlance = ({ glancePlayer, setGlancePlayer }: NosyGlanceProps) => {
  const game = useAtomValue($game);
  const currPlayer = useAtomValue($runePlayer);

  const otherPlayers =
    game &&
    Object.keys(game.players).filter(
      (playerId) => playerId !== currPlayer.playerId
    );

  //   const [glancePlayer, setGlancePlayer] = useState<string>("");

  useEffect(() => {
    console.log("game in Nosy glance", game);
  }, [game]);

  useEffect(() => {
    console.log("currplayer in Nosy glance", currPlayer);
  }, [currPlayer]);

  function glancePlayerAction(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    playerId: string
  ) {
    e.preventDefault();
    setGlancePlayer(playerId);
    console.log("playerId", playerId);

    // if confirmAction === True; setGlancePlayer(playerId);
    console.log("glance", glancePlayer);
  }

  //   function confirmGlanceAction(playerId: string) {} => returns a boolean

  const displayPlayerHands = (
    <div className={ng.actionContainer}>
      {otherPlayers &&
        otherPlayers.map((playerId, idx) => {
          return (
            <div className={ng.playerDetails}>
              <div
                className={ng.playerName}
                // {...(glancePlayer === "" && {
                //   onClick: (e) => glancePlayerAction(e, playerId),
                // })}
                onClick={(e) => glancePlayerAction(e, playerId)}
              >
                {game.players[playerId].displayName}
              </div>
              <div key={idx} className={ng.cardContainer}>
                {game.gameState.players[playerId].playerHand.map(
                  (card, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`${ng.card} ${
                          glancePlayer === playerId && ng.glanceCardAnim
                        }`}
                      >
                        <div className={ng.frontImageContainer}>
                          <div className={ng.cardDetail}>
                            <p className={ng.cardNum}>{card.cardNum}</p>
                            <p>{card.image}</p>
                            <p>{card.name}</p>
                          </div>
                        </div>

                        <div className={ng.backImageContainer}>
                          <div className={ng.backImg}>💟</div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      <div
        className={rc.doneBtnContainer}
        onClick={() => {
          setGlancePlayer("");
          Rune.actions.updateCurrentTurn();
        }}
      >
        <div className={ng.doneBtn}>👌</div>
      </div>
    </div>
  );

  return <div className={ng.playerCardsContainer}>{displayPlayerHands}</div>;
};

export default NosyGlance;

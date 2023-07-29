import React from "react";
// import { GameState } from "../../logic";
import { useAtomValue } from "jotai";
import { $game, $runePlayer } from "../../state/game";
import ng from "./NosyGlance.module.scss";
import rc from "../ResolveCard.module.scss";

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

  function glancePlayerAction(
    _e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    playerId: string
  ) {
    if (glancePlayer === "") setGlancePlayer(playerId);
  }

  const displayPlayerHands = (
    <div className={ng.actionContainer}>
      {otherPlayers &&
        otherPlayers.map((playerId, idx) => {
          return (
            <div
              key={`${playerId}-${idx}`}
              className={ng.playerDetails}
              onClick={(e) => {
                glancePlayerAction(e, playerId);
              }}
            >
              <div className={ng.playerName}>
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
                            <div className={ng.cardHeader}>
                              <p className={ng.cardNum}>{card.cardNum}</p>
                              <p className={ng.cardImage}>{card.image}</p>
                            </div>
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
      <div className={rc.doneBtnContainer}>
        <div
          className={ng.doneBtn}
          onClick={() => {
            setGlancePlayer("");
            Rune.actions.updateCurrentTurn();
          }}
        >
          👌
        </div>
      </div>
    </div>
  );

  return <div className={ng.playerCardsContainer}>{displayPlayerHands}</div>;
};

export default NosyGlance;

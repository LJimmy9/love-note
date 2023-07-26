import React, { useEffect, useState } from "react";
// import { GameState } from "../../logic";
import { useAtomValue } from "jotai";
import { $game, $runePlayer } from "../../state/game";
import ng from "./NosyGlance.module.css";

// interface NosyGlanceProps {
//   game: GameState;
// }

const NosyGlance = () => {
  const game = useAtomValue($game);
  const currPlayer = useAtomValue($runePlayer);

  const otherPlayers =
    game &&
    Object.keys(game.players).filter(
      (playerId) => playerId !== currPlayer.playerId
    );

  console.log("otherPlayers", otherPlayers);

  useEffect(() => {
    console.log("game in Nosy glance", game);
  }, [game]);

  useEffect(() => {
    console.log("currplayer in Nosy glance", currPlayer);
  }, [currPlayer]);

  const displayPlayerHands = (
    <div className={ng.actionContainer}>
      {otherPlayers &&
        otherPlayers.map((playerId, idx) => {
          return (
            <div className={ng.playerDetails}>
              <div className={ng.playerName}>
                {game.players[playerId].displayName}
              </div>
              <div key={idx} className={ng.cardContainer}>
                {game.gameState.players[playerId].playerHand.map(
                  (card, idx) => {
                    return (
                      <div key={idx} className={ng.card}>
                        <div className={ng.cardDetail}>
                          <p className={ng.cardNum}>{card.cardNum}</p>
                          <p>{card.image}</p>
                          <p>{card.name}</p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
    </div>
  );

  return <div className={ng.playerHandContainer}>{displayPlayerHands}</div>;
};

export default NosyGlance;

import { useState } from "react";
import { TattleProps } from "../CardAction/Tattle";
import { PlayerId } from "rune-games-sdk/multiplayer";
import { $gameState, $runePlayer } from "../../state/game";
import { useAtomValue } from "jotai";

import ts from "../CardAction/TradeSnacks.module.scss";
import t from "./Tattle.module.css";

function TattleSideEffect({ players }: TattleProps) {
  const gameState = useAtomValue($gameState);
  const currPlayer = useAtomValue($runePlayer);
  const [tattledOn, _setTattledOn] = useState<PlayerId>(gameState.tattledOn);

  function getResponse() {
    const absentCard = gameState.players[tattledOn].playerHand.filter(
      (card) => card.cardNum === 5
    );
    if (
      absentCard.length &&
      !gameState.absentUsed.includes(currPlayer.playerId)
    ) {
      const card = absentCard[0];
      return (
        <div>
          <div style={{ margin: "10px 0" }}>
            You can use the absent card as an alibi.
          </div>
          <div
            key={`abs-${card.id}`}
            style={{ margin: "20px auto" }}
            className={t.playerCard}
            onClick={() => {
              Rune.actions.handleCard({
                cardNum: 5,
                playersInvolved: [
                  currPlayer.playerId,
                  ...Object.keys(players).filter(
                    (playerId) => playerId !== currPlayer.playerId
                  ),
                ],
              });
            }}
          >
            <div className={ts.cardHeader}>
              <div className={ts.cardNum}>{card.cardNum}</div>
              <div className={ts.cardName}>{card.name}</div>
              <div className={ts.cardImage}>{card.image}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={t.defeat}>
          <div>{`${
            gameState.absentUsed.includes(currPlayer.playerId)
              ? "You already used the absent card!"
              : "You have no absent card!"
          }`}</div>
          You must accept defeat and go to detention.
          <div style={{ marginTop: "10px" }}>Any last words?</div>
          <div className={t.lastWordsContainer}>
            {["😥", "😂", "🤬", "💔", "👍"].map((lastWord) => {
              return (
                <span
                  className={t.lastWord}
                  onClick={() => {
                    Rune.actions.handleLastWords({ lastWord: lastWord });
                  }}
                >
                  {lastWord}
                </span>
              );
            })}
          </div>
        </div>
      );
    }
  }

  if (!tattledOn || !currPlayer.playerId) return;

  return (
    <div>
      {currPlayer.playerId === tattledOn ? (
        <>
          <div className={t.header}>
            {players[gameState.currentTurn].displayName} has Tattled on you!
          </div>
          {getResponse()}
        </>
      ) : (
        <div className={t.header}>
          <div>
            {players[tattledOn].displayName} is being tattled on by{" "}
            {players[gameState.currentTurn].displayName} !!
          </div>
          <div style={{ marginTop: "5px" }}>Waiting for their response ...</div>
          <div className={t.hourglass}>⏳</div>
        </div>
      )}
    </div>
  );
}

export default TattleSideEffect;

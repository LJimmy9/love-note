import { useState } from "react";
import { $gameState, $players, $runePlayer } from "../../state/game";
import ts from "./TradeSnacks.module.css";
import { useAtomValue } from "jotai";
import { Card } from "../../logic";

function PassDirection() {
  const players = useAtomValue($players);
  const currPlayer = useAtomValue($runePlayer);
  const gameState = useAtomValue($gameState);
  const [selected, setSelected] = useState<Card>();
  const [doneClicked, setDoneClicked] = useState<boolean>(false);

  return (
    <>
      {players && (
        <div>
          <div className={ts.instruction}>
            {`${
              players[gameState.currentTurn].displayName
            } has played Pass Direction. Select your lowest card to pass left.`}
          </div>
          <div>
            {gameState.players[currPlayer.playerId].playerHand.map((card) => {
              return (
                <div
                  key={`exchange-${card.id}`}
                  className={`${ts.playerCard} ${
                    selected?.id == card.id ? ts.selected : ""
                  }`}
                  style={{
                    margin: "10px auto",
                  }}
                  onClick={() => {
                    setSelected(card);
                  }}
                >
                  <div className={ts.cardHeader}>
                    <div className={ts.cardNum}>{card.cardNum}</div>
                    <div className={ts.cardName}>{card.name}</div>
                    <div className={ts.cardImage}>{card.image}</div>
                  </div>
                </div>
              );
            })}
            <div
              className={ts.doneBtn}
              onClick={() => {
                if (!selected) return;
                setDoneClicked(true);
                Rune.actions.selectCard({
                  cardNumInPlay: 2,
                  selectedCard: selected,
                });
              }}
            >
              👌
            </div>
            {doneClicked && (
              <div style={{ fontSize: "14px", marginTop: "20px" }}>
                Waiting for other player(s) to select a card...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PassDirection;

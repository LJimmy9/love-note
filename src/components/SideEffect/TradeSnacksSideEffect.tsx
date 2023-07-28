import { useAtomValue } from "jotai";
import { TradeSnacksProps } from "../CardAction/TradeSnacks";
import { $gameState, $runePlayer } from "../../state/game";
import ts from "../CardAction/TradeSnacks.module.css";
import { useState } from "react";
import { Card } from "../../logic";

function TradeSnacksSideEffect({ players }: TradeSnacksProps) {
  const currPlayer = useAtomValue($runePlayer);
  const gameState = useAtomValue($gameState);
  const [selected, setSelected] = useState<Card>();
  const [doneClicked, setDoneClicked] = useState<boolean>(false);

  return (
    <>
      {
        <div className={ts.instruction}>
          {gameState.currentTurn !== currPlayer.playerId ? (
            <div>
              {players[gameState.currentTurn].displayName} is trading snacks
              with you. Select your lowest card
            </div>
          ) : (
            <div>Select any card to trade.</div>
          )}
        </div>
      }
      <div>
        {gameState.players[currPlayer.playerId].playerHand.map((card) => {
          return (
            <div
              key={`exchange-${card.id}`}
              className={`${ts.playerCard} ${
                selected?.id == card.id ? ts.selected : ""
              }`}
              style={{ margin: "10px auto" }}
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
              cardNumInPlay: 3,
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
    </>
  );
}

export default TradeSnacksSideEffect;

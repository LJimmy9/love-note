import { useState, useEffect } from "react";
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

  const [priorityCardNum, setPriorityCardNum] = useState<number>();
  const [priorityError, setPriorityError] = useState<boolean>(false);

  useEffect(() => {
    const cardNums: number[] = gameState.players[
      currPlayer.playerId
    ].playerHand.map((card) => card.cardNum);

    gameState.priority === "highest"
      ? setPriorityCardNum(Math.max(...cardNums))
      : setPriorityCardNum(Math.min(...cardNums));
  }, [gameState]);

  useEffect(() => {
    return () => {
      setPriorityError(false);
    };
  }, []);

  return (
    <>
      {players && (
        <div className={ts.tradeSnackActionContainer}>
          <div className={ts.instruction}>
            {`${
              players[gameState.currentTurn].displayName
            } has played Pass Direction. Select your ${
              gameState.priority
            } card to pass ${gameState.direction}. Click 👌 when you're done`}
          </div>
          {priorityError && (
            <div style={{ color: "red" }}>
              Please select the {gameState.priority} card in your hand to pass{" "}
              {gameState.direction}.
            </div>
          )}
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
                    if (card.cardNum !== priorityCardNum) {
                      setPriorityError(true);
                      return;
                    }
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

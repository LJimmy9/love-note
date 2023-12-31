import { useState, useEffect } from "react";
import { $gameState, $players, $runePlayer } from "../../state/game";
import ts from "./TradeSnacks.module.scss";
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
  const [tattleException, setTattleException] = useState<boolean>(false);

  useEffect(() => {
    const cardNums: number[] = gameState.players[
      currPlayer.playerId
    ].playerHand.map((card) => card.cardNum);

    if (
      gameState.players[currPlayer.playerId].playerIdentity.role ===
        "Tattle Tale" &&
      cardNums.includes(1)
    ) {
      setTattleException(true);
    }

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
              currPlayer.displayName ===
              players[gameState.currentTurn].displayName
                ? "You've played"
                : `${players[gameState.currentTurn].displayName} has played`
            } Pass Direction. Select your ${gameState.priority} card to pass ${
              gameState.direction
            }. Click 👌 when you're done`}
          </div>
          {priorityError && (
            <div style={{ color: "red" }} className={ts.errorMessage}>
              Please select the {gameState.priority} card in your hand to pass{" "}
              {gameState.direction}.
            </div>
          )}
          <div className={ts.cardActionPlayContainer}>
            <div className={ts.tsCardContainer}>
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
                      if (
                        card.cardNum !== priorityCardNum &&
                        !tattleException
                      ) {
                        setPriorityError(true);
                        return;
                      }
                      priorityError && setPriorityError(false);
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
            </div>

            <div className={ts.doneBtn}>
              <div
                onClick={() => {
                  if (!selected) return;
                  setDoneClicked(true);
                  Rune.actions.selectCard({
                    cardNumInPlay: 2,
                    selectedCard: selected,
                  });
                }}
              >
                {`${doneClicked ? "✔️" : "👌"}`}
              </div>
            </div>
            {doneClicked && (
              <div className={ts.doneClick}>
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

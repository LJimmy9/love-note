import { $gameState, $players, $runePlayer } from "../../state/game";
import ts from "./TradeSnacks.module.css";
import { useAtomValue } from "jotai";

function PassDirection() {
  const players = useAtomValue($players);
  const currPlayer = useAtomValue($runePlayer);
  const gameState = useAtomValue($gameState);

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
                  className={ts.playerCard}
                  style={{ margin: "10px auto" }}
                  onClick={() =>
                    Rune.actions.selectCard({
                      cardNumInPlay: 2,
                      selectedCard: card,
                    })
                  }
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
        </div>
      )}
    </>
  );
}

export default PassDirection;

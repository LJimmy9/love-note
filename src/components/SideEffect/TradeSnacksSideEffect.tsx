import { useAtomValue } from "jotai";
import { TradeSnacksProps } from "../CardAction/TradeSnacks";
import { $gameState, $runePlayer } from "../../state/game";
import ts from "../CardAction/TradeSnacks.module.css";

function TradeSnacksSideEffect({ players }: TradeSnacksProps) {
  const currPlayer = useAtomValue($runePlayer);
  const gameState = useAtomValue($gameState);

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
              className={ts.playerCard}
              style={{ margin: "10px auto" }}
              onClick={() =>
                Rune.actions.selectCard({
                  cardNumInPlay: 3,
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
    </>
  );
}

export default TradeSnacksSideEffect;

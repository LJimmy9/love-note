import { useAtomValue } from "jotai";
import { $game } from "../state/game";
import DeckCard from "./DeckCard";
import DiscardCard from "./DiscardCard";
import ResolveCard from "./ResolveCard";

import gf from "./GameField.module.css";

export const GameField = () => {
  const game = useAtomValue($game);
  if (!game) return;

  return (
    <div className={gf.gameActionFieldContainer}>
      <div className={gf.gameActionField}>
        <div className={gf.deckContainer}>
          <div className={gf.deck}>
            {game.gameState.deck.map((deckCard, idx) => {
              return (
                <DeckCard
                  key={`deck-card-${deckCard.id}-${idx}`}
                  card={deckCard}
                  currentTurn={game.gameState.currentTurn}
                />
              );
            })}
          </div>
        </div>
        <div className={gf.discardContainer}>
          {game.gameState.discardedCards.map((discardedCard, idx) => {
            return (
              <DiscardCard
                key={`discard-card-${discardedCard.id}-${idx}`}
                card={discardedCard}
              />
            );
          })}
        </div>
      </div>

      {/* Resolve Card */}
      {game.gameState.gamePhase == "Resolve" && (
        <div>
          <ResolveCard players={game.players} />
        </div>
      )}
    </div>
  );
};

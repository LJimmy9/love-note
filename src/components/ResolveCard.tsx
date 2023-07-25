import { ReactElement } from "react";
import { Card, GameState } from "../logic";
import rc from "./ResolveCard.module.css";

interface ResolveCardProps {
  game: GameState;
}

interface UiMapProps {
  [key: string]: ReactElement<unknown>;
}

function ResolveCard({ game }: ResolveCardProps) {
  function getCardAction() {
    const cardPlayed: Card =
      game.discardedCards[game.discardedCards.length - 1];

    const uiMap: UiMapProps = {
      4: <div>select a player to exchange cards with</div>,
    };

    return uiMap[cardPlayed.cardNum as number];
  }

  const cardActions = getCardAction();
  return (
    <>
      <div className={rc.resolveCard}>
        {cardActions}
        <div
          className={rc.doneBtn}
          onClick={() => Rune.actions.updateCurrentTurn()}
        >
          done
        </div>
      </div>
    </>
  );
}

export default ResolveCard;

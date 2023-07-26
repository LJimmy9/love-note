import { ReactElement } from "react";
import { Card, GameState } from "../logic";
import rc from "./ResolveCard.module.css";
import NosyGlance from "./CardAction/NosyGlance";
import ng from "../components/CardAction/NosyGlance.module.css";

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
      3: (
        <>
          <div>Select a player to exchange cards with</div>
        </>
      ),
      4: (
        <div className={ng.gameActionField}>
          <div style={{ fontSize: "12px" }}>
            Select a player to peek at their cards
          </div>
          <NosyGlance />
        </div>
      ),
    };

    return uiMap[cardPlayed.cardNum as number];
  }
  const cardAction = getCardAction();
  return (
    <>
      <div className={rc.resolveCard}>
        {cardAction}
        <div
          className={rc.doneBtnContainer}
          onClick={() => Rune.actions.updateCurrentTurn()}
        >
          <div className={rc.doneBtn}>Done</div>
        </div>
      </div>
    </>
  );
}

export default ResolveCard;

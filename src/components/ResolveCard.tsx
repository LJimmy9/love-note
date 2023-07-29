import { ReactElement, useState } from "react";
import rc from "./ResolveCard.module.css";
import NosyGlance from "./CardAction/NosyGlance";
import RainyDay from "./CardAction/RainyDay";
import { Card } from "../logic";
import { $gameState, $runePlayer, AtomPlayer } from "../state/game";
import TradeSnacks from "./CardAction/TradeSnacks";
import { useAtomValue } from "jotai";
import TradeSnacksSideEffect from "./SideEffect/TradeSnacksSideEffect";
import PassDirection from "./CardAction/PassDirection";
import OppositeDay from "./CardAction/OppositeDay";

export interface AtomPlayerObj {
  [key: string]: AtomPlayer;
}

interface ResolveCardProps {
  players: AtomPlayerObj;
}

interface UiMapProps {
  [key: string]: ReactElement<unknown>;
}

function ResolveCard({ players }: ResolveCardProps) {
  const [glancePlayer, setGlancePlayer] = useState<string>("");
  const currPlayer = useAtomValue($runePlayer);
  const gameState = useAtomValue($gameState);

  function getCardAction() {
    const cardPlayed: Card =
      gameState.discardedCards[gameState.discardedCards.length - 1];

    const uiMap: UiMapProps = {
      3: (
        <>
          <TradeSnacks players={players} />
        </>
      ),
      4: (
        <div className={rc.resolveGameActionField}>
          <div style={{ lineHeight: "15px" }}>
            Select a player to peek at their cards
          </div>
          <div>Click 👌 when you're done</div>
          <NosyGlance
            glancePlayer={glancePlayer}
            setGlancePlayer={setGlancePlayer}
          />
        </div>
      ),
    };

    return uiMap[cardPlayed.cardNum as number];
  }

  function getSideEffect() {
    const playerSideEffect = gameState.players[currPlayer.playerId].sideEffect;
    if (!playerSideEffect.active) return null;

    const uiMap: UiMapProps = {
      2: <PassDirection />,
      3: <TradeSnacksSideEffect players={players} />,
      7: <OppositeDay />,
      8: (
        <div className={rc.resolveGameActionField}>
          <RainyDay />
        </div>
      ),
    };

    return uiMap[playerSideEffect.cardNum as number];
  }

  const cardAction = getCardAction();
  const sideEffect = getSideEffect();
  return (
    <div
      className={`${
        gameState.discardedCards[gameState.discardedCards.length - 1]
          .cardNum !== 7 && rc.resolveActionFieldContainer
      }`}
    >
      {gameState.currentTurn === currPlayer.playerId && !sideEffect && (
        <div className={rc.resolveActionField}>{cardAction}</div>
      )}
      {sideEffect && <div className={rc.resolveActionField}>{sideEffect}</div>}
    </div>
  );
}

export default ResolveCard;

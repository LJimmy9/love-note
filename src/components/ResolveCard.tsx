import { ReactElement, useState } from "react";
import rc from "./ResolveCard.module.scss";
import NosyGlance from "./CardAction/NosyGlance";
import RainyDay from "./CardAction/RainyDay";
import { Card } from "../logic";
import { $gameState, $runePlayer, AtomPlayer } from "../state/game";
import TradeSnacks from "./CardAction/TradeSnacks";
import { useAtomValue } from "jotai";
import TradeSnacksSideEffect from "./SideEffect/TradeSnacksSideEffect";
import PassDirection from "./CardAction/PassDirection";
import OppositeDay from "./CardAction/OppositeDay";
import Tattle from "./CardAction/Tattle";
import TattleSideEffect from "./SideEffect/TattleSideEffect";
import AbsentSideEffect from "./SideEffect/AbsentSideEffect";
import LastWordsSideEffect from "./SideEffect/LastWordsSideEffect";
import LoversWinSideEffect from "./SideEffect/LoversWinSideEffect";

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

    if (!cardPlayed) return <></>;

    const uiMap: UiMapProps = {
      1: <Tattle players={players} />,
      3: <TradeSnacks players={players} />,
      4: (
        <div className={rc.resolveGameActionField}>
          <div className={rc.resolveText}>
            Select a player to peek at their cards
            <div>Click 👌 when you're done</div>
          </div>
          <NosyGlance
            glancePlayer={glancePlayer}
            setGlancePlayer={setGlancePlayer}
          />
        </div>
      ),
      9: <></>,
    };

    return uiMap[cardPlayed.cardNum as number];
  }

  function getSideEffect() {
    const playerSideEffect = gameState.players[currPlayer.playerId].sideEffect;
    if (!playerSideEffect.active) return null;

    const uiMap: UiMapProps = {
      1: <TattleSideEffect players={players} />,
      2: <PassDirection />,
      3: <TradeSnacksSideEffect players={players} />,
      5: <AbsentSideEffect players={players} />,
      7: <OppositeDay />,
      8: (
        <div className={rc.resolveGameActionField}>
          <RainyDay />
        </div>
      ),
      9: <LoversWinSideEffect players={players} />,
      10: <LastWordsSideEffect players={players} />,
    };

    return uiMap[playerSideEffect.cardNum as number];
  }

  const cardAction = getCardAction();
  const sideEffect = getSideEffect();

  const display = gameState.discardedCards[
    gameState.discardedCards.length - 1
  ] ? (
    <>
      {" "}
      <div
        className={`${
          gameState.discardedCards[gameState.discardedCards.length - 1]
            .cardNum !== 7 && rc.resolveActionFieldContainer
        }`}
      >
        {gameState.currentTurn === currPlayer.playerId && !sideEffect && (
          <div className={rc.resolveActionField}>{cardAction}</div>
        )}
        {sideEffect && (
          <div className={rc.resolveActionField}>{sideEffect}</div>
        )}
      </div>
    </>
  ) : (
    <div className={rc.resolveActionFieldContainer}>
      {sideEffect && <div className={rc.resolveActionField}>{sideEffect}</div>}
    </div>
  );
  return <>{display}</>;
}

export default ResolveCard;

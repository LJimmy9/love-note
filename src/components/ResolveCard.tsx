import { ReactElement, useState } from "react";
import rc from "./ResolveCard.module.css";
import NosyGlance from "./CardAction/NosyGlance";
import ng from "../components/CardAction/NosyGlance.module.css";
import { Card } from "../logic";
import { $gameState, $runePlayer, AtomPlayer } from "../state/game";
import s from "./PlayCard.module.css";
import TradeSnacks from "./TradeSnacks";
import { useAtomValue } from "jotai";

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
        <div className={ng.resolveGameActionField}>
          <div style={{ fontSize: "12px" }}>
            Select a player to peek at their cards
          </div>
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
      3: (
        <>
          {gameState.currentTurn !== currPlayer.playerId ? (
            <div>
              {players[gameState.currentTurn].displayName} is trading snacks
              with you. Select your lowest card
            </div>
          ) : (
            <div>Select any card to trade.</div>
          )}
          <div>
            {gameState.players[currPlayer.playerId].playerHand.map((card) => {
              return (
                <div
                  key={`exchange-${card.id}`}
                  className={s.playerCard}
                  style={{ marginTop: "10px", marginLeft: "30px" }}
                >
                  <div className={s.cardHeader}>
                    <div className={s.cardNum}>{card.cardNum}</div>
                    <div className={s.cardName}>{card.name}</div>
                    <div className={s.cardImage}>{card.image}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ),
    };

    return uiMap[playerSideEffect.cardNum as number];
  }

  const cardAction = getCardAction();
  const sideEffect = getSideEffect();
  return (
    <div className={rc.resolveActionFieldContainer}>
      {gameState.currentTurn === currPlayer.playerId && !sideEffect && (
        <div className={rc.resolveActionField}>{cardAction}</div>
      )}
      {sideEffect && <div className={rc.resolveActionField}>{sideEffect}</div>}
    </div>
  );
}

export default ResolveCard;

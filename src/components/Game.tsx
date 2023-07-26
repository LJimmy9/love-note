import { GamePlayer} from "../logic";

import DeckCard from "./DeckCard";
import PlayCard from "./PlayCard";
import ph from "./PlayerHand.module.css";
import gf from "./GameField.module.css";
import DiscardCard from "./DiscardCard";
import { useState } from "react";
import {CardInfoDisplay, IdCardInfoDisplay}  from "./InfoCard";

import { $game, $runePlayer } from "../state/game";
import { useAtomValue } from "jotai";

interface GameProps {
  player: GamePlayer;
  pinPos: number[];
}

type CardRotationConfig = {
  [key: number]: string;
};

const cardRotationConfig: CardRotationConfig = {
  0: "-5deg",
  1: "3deg",
  2: "8deg",
};


const Game = ({ player, pinPos }: GameProps) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const currPlayer = useAtomValue($runePlayer);
  const game = useAtomValue($game);

  return (
    game && (
      <div className={gf.gameContainer}>
        <div className={gf.currentGameDetail}>
          <div className={gf.turnContainer}>
            <p className={gf.gameTurn}>Turn: {game.gameState.turnNum}</p>
            <p className={gf.playerTurn}>
              Player Turn:{" "}
              {`${
                game.yourPlayerId === game.gameState.currentTurn
                  ? "Your turn"
                  : currPlayer.displayName
              }`}
            </p>
            <p>{`Current game phase: ${game.gameState.gamePhase}`}</p>
          </div>

          <div className={gf.infoButtonContainer}>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={gf.infoBtn}
            >
              info
            </button>
          </div>
        </div>
        <div className={gf.gameActionFieldContainer}>
          <div className={gf.gameActionField}>
            <div className={gf.deckContainer}>
              <div className={gf.deck}>
                {game.gameState.deck.map((deckCard) => {
                  return (
                    <DeckCard
                      key={`deck-card-${deckCard.id}`}
                      card={deckCard}
                      currentTurn={game.gameState.currentTurn}
                    />
                  );
                })}
              </div>
            </div>
            <div className={gf.discardContainer}>
              {game.gameState.discardedCards.map((discardedCard) => {
                return (
                  <DiscardCard
                    key={`discard-card-${discardedCard.id}`}
                    card={discardedCard}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {showInfo && (
          <div className={gf.infoCard}>
            <div className={gf.infoHeader}>
              <p className={gf.infoTitle}>❤️ Love Note ❤️</p>
              <button onClick={() => setShowInfo(false)}>&times;</button>
            </div>
            <div>
              <p className={gf.infoTitle}> Overview </p>
              <p className={gf.infoContent}>You are in school where love and rumors are running rampant. Lovers are secretly filling out Love Notes, hoping to win a prize. Tattle Tales are on the prowl, looking for any sign of love so they can tattle on the Lovers and win a prize of their own.</p>
              <p className={gf.infoContent}><span className={gf.infoBullet}>To Win:</span> 
                <ul>
                  <li>Lovers need to fill out a Love Note to win.</li>
                  <li>Tattle Tales need to find the Lovers and tattle on them to win.</li>
                  <li>Friends need to help out the lovers.</li>
                </ul>
               </p>
               <p className={gf.infoContent}><span className={gf.infoBullet}>To Play:</span>
                <ul>
                  <li>To draw tap on the deck.</li>
                  <li>To play a card tap on a card and press the button in the top right. Tap the card again to cancel.</li>
                </ul>
               </p>
            </div>
            <div>
              <p className={gf.infoTitle}> Cards </p>
              <CardInfoDisplay />
              <p className={gf.infoTitle}> Identity Cards </p>
              <IdCardInfoDisplay />
            </div>
          </div>
        )}
        <div className={`${gf.playerHandContainer}`}>
          <div className={`${ph.flexCenterPlayerHand}`}>
            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: `${
                  player.playerHand.length === 3
                    ? "repeat(5, 25px)"
                    : "repeat(4, 25px)"
                }`,
              }}
            >
              {player.playerHand.map((cardVal, idx) => {
                return (
                  <PlayCard
                    key={`${cardVal}- ${idx}`}
                    game={game.gameState}
                    card={cardVal}
                    player={player}
                    cardRotation={cardRotationConfig[idx]}
                    left={"0px"}
                    top={idx === 2 ? "8px" : "0px"}
                    pinPos={pinPos}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Game;

import { GamePlayer } from "../logic";

import DeckCard from "./DeckCard";
import PlayCard from "./PlayCard";
import ph from "./PlayerHand.module.css";
import gf from "./GameField.module.css";
import DiscardCard from "./DiscardCard";
import { useState } from "react";
import { CardInfoDisplay, IdCardInfoDisplay } from "./InfoCard";
import { $game, $runePlayer } from "../state/game";
import { useAtomValue } from "jotai";
import ResolveCard from "./ResolveCard";
import gi from "./GameInfo.module.css";

interface GameProps {
  player: GamePlayer;
  pinPos: number[];
}

type CardRotationConfig = {
  [key: number]: string;
};

const cardRotationConfig: CardRotationConfig = {
  0: "-3deg",
  1: "5deg",
  2: "10deg",
};

type classMapConfig = {
  [key: number]: string;
};

const classMap: classMapConfig = {
  1: `${gf.otherplayerLeftBottom}`,
  2: `${gf.otherplayerLeftMiddle}`,
  //3: `${gf.otherplayerLeftTop}`,
  //4: `${gf.otherplayerRightTop}`,
  3: `${gf.otherplayerRightBottom}`,
  4: `${gf.otherplayerRightMiddle}`
}

const Game = ({ player, pinPos }: GameProps) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const currPlayer = useAtomValue($runePlayer);
  const game = useAtomValue($game);
  let count = 0;

  return (
    game && (
      <div className={gf.gameContainer}>
        <div className={gf.currentGameDetail}>
          <div className={gf.turnContainer}>
            <p className={gf.gameTurn}>
              Identity:{" "}
              {game.gameState.players[currPlayer.playerId].playerIdentity.name}
            </p>
            <p className={gf.playerTurn}>
              Player Turn:{" "}
              {`${
                game.yourPlayerId === game.gameState.currentTurn
                  ? "Your turn"
                  : game.players[game.gameState.currentTurn].displayName
              }`}
            </p>
            <p>{`Current game phase: ${game.gameState.gamePhase}`}</p>
          </div>

          <div className={gi.infoButtonContainer}>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={gi.infoBtn}
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
          {/* Resolve Card */}
          {game.gameState.gamePhase == "Resolve" && (
            <div>
              <ResolveCard players={game.players} />
            </div>
          )}
        </div>
        {showInfo && (
          <div className={gi.infoCard}>
            <div className={gi.infoHeader}>
              <p className={gi.infoTitle}>❤️ Love Note ❤️</p>
              <button onClick={() => setShowInfo(false)}>&times;</button>
            </div>
            <div>
              <p className={gi.infoTitle}> Overview </p>
              <p className={gi.infoContent}>
                You are in school where love and rumors are running rampant.
                Lovers are secretly filling out Love Notes, hoping to win a
                prize. Tattle Tales are on the prowl, looking for any sign of
                love so they can tattle on the Lovers and win a prize of their
                own.
              </p>
              <p className={gi.infoContent}>
                <span className={gi.infoBullet}>To Win:</span>
                <ul>
                  <li>Lovers need to fill out a Love Note to win.</li>
                  <li>
                    Tattle Tales need to find the Lovers and tattle on them to
                    win.
                  </li>
                  <li>Friends need to help out the lovers.</li>
                </ul>
              </p>
              <p className={gi.infoContent}>
                <span className={gi.infoBullet}>To Play:</span>
                <ul>
                  <li>To draw tap on the deck.</li>
                  <li>
                    To play a card tap on a card and press the button in the top
                    right. Tap the card again to cancel.
                  </li>
                </ul>
              </p>
            </div>
            <div>
              <p className={gi.infoTitle}> Cards </p>
              <CardInfoDisplay />
              <p className={gi.infoTitle}> Identity Cards </p>
              <IdCardInfoDisplay />
            </div>
          </div>
        )}

        {Object.keys(game.gameState.players).map(playerID => 
        {
          const p = game.gameState.players[playerID];
          if (playerID === game.yourPlayerId) 
          {
            return (
              <div className={`${ph.playerHandContainer}`}>
                <div className={`${ph.flexCenterPlayerHand}`}>
                  {player.playerHand.map((cardVal, idx) => {
                    return (
                      <div key={`${cardVal}-${idx}`}>
                        <PlayCard
                          game={game.gameState}
                          card={cardVal}
                          player={player}
                          pinPos={pinPos}
                          cardRotation={cardRotationConfig[idx]}
                          clickable={true}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          }
          else 
          {
            count++;
            return (
              <div className={classMap[count]}>
                <div style={{height:'40px'}}>
                <div className={`${ph.flexCenterPlayerHand}`}>
                  {p.playerHand.map((cardVal, idx) => {
                    return (
                    <div key={`${cardVal}- ${idx}- ${p.playerIdentity.name}- ${game.yourPlayerId}`}>
                      <PlayCard
                      game={game.gameState}
                      card={cardVal}
                      player={p}
                      cardRotation={cardRotationConfig[idx]}
                      pinPos={pinPos}
                      clickable={false}/>
                    </div>
                    );
                  })}
                  </div>
                </div>
                <p className={`${gf.otherplayerName}`}>{p.playerIdentity.name}</p>
              </div>
            );
          }
        })}

        {/* Resolve Card
        {game.gameState.gamePhase == "Resolve" && (
          <div>
            <ResolveCard players={game.players} />
          </div>
        )} */}
      </div>
    )
  );
};

export default Game;

import { GamePlayer } from "../logic";
import DeckCard from "./DeckCard";
import PlayCard from "./PlayCard";
import ph from "./PlayerHand.module.css";
import gf from "./GameField.module.css";
import DiscardCard from "./DiscardCard";
import { useEffect, useRef, useState } from "react";
import { CardInfoDisplay, IdCardInfoDisplay } from "./InfoCard";
import { $game, $runePlayer } from "../state/game";
import { useAtomValue } from "jotai";
import ResolveCard from "./ResolveCard";
import gi from "./GameInfo.module.css";
import AnimGen from "./Animations/AnimGen";
import bgm from "../assets/bgm.mp3";

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
  2: `${gf.otherplayerRightBottom}`,
  3: `${gf.otherplayerLeftMiddle}`,
  4: `${gf.otherplayerRightMiddle}`,
};

const Game = ({ player, pinPos }: GameProps) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const currPlayer = useAtomValue($runePlayer);
  const [showPlayerInfo, setShowPlayerInfo] = useState<boolean>(false);

  const [activePlayer, setActivePlayer] = useState<string>("");

  const game = useAtomValue($game);
  const bgmRef = useRef<any>();
  const [music, setMusic] = useState<boolean>(true);

  useEffect(() => {
    if (!bgmRef.current) return;
    bgmRef.current.volume = 0.5;
    bgmRef.current.onended = () => {
      bgmRef.current.remove();
    };
  }, [bgmRef.current]);

  useEffect(() => {
    if (music && game) {
      bgmRef.current.play();
    }
  }, [music, game]);

  const displayPlayerInfo = (id: string) => {
    return id === activePlayer
      ? `${gi.activePlayerInfoContainer}`
      : `${gi.nonActivePlayerInfo}`;
  };

  return (
    <>
      <AnimGen />
      {game && (
        <div className={gf.gameContainer}>
          <audio ref={bgmRef} src={bgm} loop />
          <div className={gf.currentGameDetail}>
            <div className={gf.turnContainer}>
              <p>
                Direction: {game.gameState.priority} to the{" "}
                {game.gameState.direction}
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
          {showInfo && (
            <div className={gi.infoCard}>
              <div className={gi.infoHeader}>
                <p className={gi.infoTitle}>❤️ Love Note ❤️</p>
                <button onClick={() => setShowInfo(false)}>&times;</button>
              </div>
              <div>
                <div className={gi.infoTitle}> Overview </div>
                <div className={gi.infoContent}>
                  You are in school where love and rumors are running rampant.
                  Lovers are secretly filling out Love Notes, hoping to win a
                  prize. Tattle Tales are on the prowl, looking for any sign of
                  love so they can tattle on the Lovers and win a prize of their
                  own.
                </div>
                <div className={gi.infoContent}>
                  <span className={gi.infoBullet}>To Win:</span>
                  <ul>
                    <li key={"li1"}>
                      Lovers need to fill out a Love Note to win.
                    </li>
                    <li key={"li2"}>
                      Tattle Tales need to find the Lovers and tattle on them to
                      win.
                    </li>
                    <li key={"li3"}>Friends need to help out the lovers.</li>
                  </ul>
                </div>
                <div className={gi.infoContent}>
                  <span className={gi.infoBullet}>To Play:</span>
                  <ul>
                    <li key={"li1"}>To draw tap on the deck.</li>
                    <li key={"li2"}>
                      To play a card tap on a card and press the button in the
                      top right. Tap the card again to cancel.
                    </li>
                  </ul>{" "}
                </div>
              </div>
              <div>
                <p className={gi.infoTitle}> Cards </p>
                <CardInfoDisplay />
                <p className={gi.infoTitle}> Identity Cards </p>
                <IdCardInfoDisplay />
              </div>
            </div>
          )}
          {Object.keys(game.gameState.players).map((playerID, idx) => {
            const p = game.gameState.players[playerID];
            if (playerID === game.yourPlayerId) {
              return (
                <div
                  className={`${ph.playerHandContainer}`}
                  key={`gamestate-${idx}-${currPlayer.playerId}`}
                  style={{
                    zIndex: "10",
                  }}
                >
                  <div
                    className={gi.playerInfoActionContainer}
                    onClick={() => setShowPlayerInfo(!showPlayerInfo)}
                  >
                    !
                  </div>
                  {showPlayerInfo && (
                    <div className={gi.playerInfoContainer}>
                      <div
                        onClick={() => setShowPlayerInfo(false)}
                        style={{ textAlign: "right" }}
                      >
                        X
                      </div>
                      <div className={gi.playerInfoContent}>
                        <p>Display Name: {currPlayer.displayName}</p>
                        <p>
                          Identity:{" "}
                          {
                            game.gameState.players[currPlayer.playerId]
                              .playerIdentity.role
                          }
                        </p>
                        <p>
                          Identity Name:{" "}
                          {
                            game.gameState.players[currPlayer.playerId]
                              .playerIdentity.name
                          }
                        </p>

                        <p>
                          Your mission:{" "}
                          {
                            game.gameState.players[currPlayer.playerId]
                              .playerIdentity.description
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  <div className={`${ph.flexCenterPlayerHand}`}>
                    {player.playerHand.map((cardVal, phdIdx) => {
                      return (
                        <div key={`${cardVal}-${phdIdx}`}>
                          <PlayCard
                            key={`${cardVal}-${phdIdx}-${currPlayer.playerId}`}
                            game={game.gameState}
                            card={cardVal}
                            player={player}
                            pinPos={pinPos}
                            cardRotation={cardRotationConfig[phdIdx]}
                            clickable={true}
                            currentPlayer={playerID === currPlayer.playerId}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              return (
                <div>
                  {activePlayer !== "" && playerID === activePlayer && (
                    <div className={displayPlayerInfo(playerID)}>
                      <div className={gi.activePlayerInfo}>
                        <div
                          className={gi.exitButton}
                          onClick={() => setActivePlayer("")}
                        >
                          X
                        </div>
                        <p>Player Name: {game.players[playerID].displayName}</p>
                      </div>
                    </div>
                  )}
                  <div
                    className={classMap[idx + 1]}
                    key={`gamestate-${idx}-${currPlayer.playerId}`}
                  >
                    <div style={{ height: "40px" }}>
                      <div className={`${ph.flexCenterPlayerHand}`}>
                        {p.playerHand.map((cardVal, sphIdx) => {
                          return (
                            <PlayCard
                              key={`${cardVal}-${sphIdx}-${currPlayer.playerId}`}
                              game={game.gameState}
                              card={cardVal}
                              player={p}
                              cardRotation={cardRotationConfig[sphIdx]}
                              pinPos={pinPos}
                              clickable={false}
                              currentPlayer={playerID === currPlayer.playerId}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className={`${gf.otherplayerName}`}
                      onClick={() => setActivePlayer(playerID)}
                      id={`player-${idx}`}
                    >
                      <svg width="20" height="20">
                        <image
                          href={game.players[playerID].avatarUrl}
                          width="15"
                          height="15"
                        />
                      </svg>
                    </div>
                    <p className={`${gf.otherplayerName}`}>
                      {p.playerIdentity.name}
                    </p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </>
  );
};

export default Game;

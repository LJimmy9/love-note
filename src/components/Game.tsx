import { GamePlayer, GameState, Card } from "../logic";
import DeckCard from "./DeckCard";
import PlayCard from "./PlayCard";
import ph from "./PlayerHand.module.css";
import gf from "./GameField.module.css";
import DiscardCard from "./DiscardCard";
import { useState } from "react";
import {CardInfoDisplay, IdCardInfoDisplay}  from "./InfoCard";

interface GameProps {
  game: GameState;
  player: GamePlayer;
  pinPos: number[];
  card: Card;
}

type CardRotationConfig = {
  [key: number]: string;
};

const cardRotationConfig: CardRotationConfig = {
  0: "-5deg",
  1: "3deg",
  2: "8deg",
};

const Game = ({ game, player, pinPos}: GameProps) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <div className={gf.gameContainer}>
      <div className={gf.currentGameDetail}>
        <div className={gf.turnContainer}>
          <p className={gf.gameTurn}>Turn: {game.turnNum}</p>
          <p className={gf.playerTurn}>
            Player Turn:{" "}
            {`${
              player.playerId === game.currentTurn
                ? "Your turn"
                : game.players[game.currentTurn].displayName
            }`}
          </p>
        </div>

        <div className={gf.infoButtonContainer}>
          <button onClick={() => setShowInfo(!showInfo)} className={gf.infoBtn}>
            info
          </button>
        </div>
      </div>
      <div className={gf.gameActionFieldContainer}>
        <div className={gf.gameActionField}>
          <div className={gf.deckContainer}>
            <div className={gf.deck}>
              {game.deck.map((deckCard) => {
                return (
                  <DeckCard
                    key={`deck-card-${deckCard.id}`}
                    card={deckCard}
                    player={player}
                    currentTurn={game.currentTurn}
                  />
                );
              })}
            </div>
          </div>
          <div className={gf.discardContainer}>
            {game.discardedCards.map((discardedCard) => {
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
            Love Note
            <button onClick={() => setShowInfo(false)}>&times;</button>
          </div>
          <div>  
          <CardInfoDisplay />
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
                  game={game}
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
  );
};

export default Game;

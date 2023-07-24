import { GamePlayer, GameState } from "../logic";
import DeckCard from "./DeckCard";
import PlayCard from "./PlayCard";
import ph from "./PlayerHand.module.css";
import gf from "./GameField.module.css";
import DiscardCard from "./DiscardCard";
import { useState } from "react";

interface GameProps {
  game: GameState;
  player: GamePlayer;
  pinPos: number[];
}

type CardRotationConfig = {
  [key: number]: string;
};

const cardRotationConfig: CardRotationConfig = {
  0: "-5deg",
  1: "5deg",
  2: "8deg",
};

const Game = ({ game, player, pinPos }: GameProps) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <div>
      <div className={ph.deck}>
        {game.deck.map((deckCard) => {
          return (
            <DeckCard
              key={`deck-card-${deckCard.id}`}
              card={deckCard}
              player={player}
            />
          );
        })}
      </div>
      <div className={ph.discard}>
        {game.discardedCards.map((discardedCard) => {
          return (
            <DiscardCard
              key={`discard-card-${discardedCard.id}`}
              card={discardedCard}
            />
          );
        })}
      </div>
      <div>
        <p className={gf.gameTurn}>Turn: {game.turnNum}</p>
        <p className={gf.playerTurn}>
          Player Turn: {game.players[game.currentTurn].displayName}
        </p>
      </div>
      <button onClick={() => setShowInfo(!showInfo)} className={gf.infoBtn}>
        info
      </button>
      {showInfo && (
        <div className={gf.infoCard}>
          <div className={gf.infoHeader}>
            Love Note
            <button onClick={() => setShowInfo(false)}>&times;</button>
          </div>
          <div>body</div>
        </div>
      )}
      <div className={`${ph.playerHandContainer}`}>
        <div className={`${ph.flexCenterPlayerHand}`}>
          <div
            style={{
              display: "grid",
              gap: "0.5rem",
              gridTemplateColumns: `${
                player.playerHand.length === 2
                  ? "repeat(4, 25px)"
                  : "repeat(6, 25px)"
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
                  top={"0px"}
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

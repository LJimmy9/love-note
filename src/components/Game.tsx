import { GamePlayer } from "../logic";
import { useEffect, useRef, useState } from "react";
import { $game, $runePlayer } from "../state/game";
import { useAtomValue } from "jotai";
import { GameField } from "./GameField";
import { GameInfo } from "./GameInfo";
import { PlayerHand } from "./PlayerHand";
import { OppponentHand } from "./OpponentHand";
import { InfoHeader } from "./InfoHeader";
import AnimGen from "./Animations/AnimGen";
import bgm from "../assets/bgm.mp3";

import gf from "./GameField.module.scss";

interface GameProps {
  player: GamePlayer;
  pinPos: number[];
}

export type CardRotationConfig = {
  [key: number]: string;
};

const cardRotationConfig: CardRotationConfig = {
  0: "-3deg",
  1: "5deg",
  2: "10deg",
};

const Game = ({ player, pinPos }: GameProps) => {
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const currPlayer = useAtomValue($runePlayer);
  const [showPlayerInfo, setShowPlayerInfo] = useState<boolean>(false);

  const [activePlayer, setActivePlayer] = useState<string>("");
  const music = true;

  const game = useAtomValue($game);
  const bgmRef = useRef<any>();

  useEffect(() => {
    if (!bgmRef.current) return;
    bgmRef.current.volume = 0.5;
    bgmRef.current.onended = () => {
      bgmRef.current.remove();
    };
  }, [bgmRef]);

  useEffect(() => {
    if (music && game) {
      bgmRef.current.play();
    }
  }, [music, game]);

  let counter = 0;

  return (
    <div>
      <AnimGen />
      <GameInfo showInfo={showInfo} setShowInfo={setShowInfo} />{" "}
      <div>
        {game && (
          <div className={gf.gameContainer}>
            <audio ref={bgmRef} src={bgm} loop />
            <InfoHeader showInfo={showInfo} setShowInfo={setShowInfo} />
            <GameField />
            {Object.keys(game.gameState.players).map((playerId, idx) => {
              if (playerId === game.yourPlayerId) {
                return (
                  <PlayerHand
                    key={`${currPlayer.playerId}-${idx}`}
                    idx={idx}
                    currPlayer={currPlayer}
                    player={player}
                    playerId={playerId}
                    pinPos={pinPos}
                    cardRotationConfig={cardRotationConfig}
                    showPlayerInfo={showPlayerInfo}
                    setShowPlayerInfo={setShowPlayerInfo}
                  />
                );
              } else {
                counter++;
                return (
                  <OppponentHand
                    key={`${currPlayer.playerId}-${idx}`}
                    activePlayer={activePlayer}
                    playerId={playerId}
                    idx={counter}
                    pinPos={pinPos}
                    cardRotationConfig={cardRotationConfig}
                    setActivePlayer={setActivePlayer}
                  />
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;

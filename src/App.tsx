import { useEffect, useState } from "react";
import "./App.css";
import Game from "./components/Game";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { $game } from "./state/game.ts";
import { $isAnimating, $playAnimation } from "./state/animations.ts";
import GifEffects from "./components/Animations/GifEffects.tsx";

function App() {
  const [game, setGame] = useAtom($game);
  const [pinPos] = useState<number[]>([]);
  const [loveNoteHolder, setLoveNoteHolder] = useState<string>("");

  const playAnimation = useSetAtom($playAnimation);

  const isAnimating = useAtomValue($isAnimating);

  useEffect(() => {
    Rune.initClient({
      onChange: ({ newGame, yourPlayerId, players }) => {
        // assign loveNoteHolder
        const allPlayers = Object.keys(newGame.players);
        if (allPlayers.length) {
          for (let i = 0; i < allPlayers.length; i++) {
            const playerHand = newGame.players[allPlayers[i]].playerHand;
            if (playerHand.find((card) => card.cardNum === 0)) {
              setLoveNoteHolder(allPlayers[i]);
              break;
            }
          }
        }

        setGame({
          gameState: newGame,
          players: players,
          yourPlayerId: yourPlayerId ? yourPlayerId : "",
        });

        if (!isAnimating) {
          playAnimation(newGame.animation);
        }
      },
    });
  }, []);

  useEffect(() => {
    if (loveNoteHolder) {
      Rune.actions.setLoveNoteHolder({ loveNoteHolder: loveNoteHolder });
    }
  }, [loveNoteHolder]);

  if (!game || !game.gameState) {
    return <div>Loading...</div>;
  }

  const configureGameStateUI =
    game.gameState.started && game.yourPlayerId ? (
      <div
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#fbd9bb",
        }}
      >
        <GifEffects />
        <Game
          player={game.gameState.players[game.yourPlayerId]}
          pinPos={pinPos}
        />
      </div>
    ) : (
      <div>
        {Object.keys(game.players).map((playerId, idx) => {
          return (
            <div key={playerId + idx}>
              <div key={idx}>
                {game.players[playerId].displayName}{" "}
                {game.yourPlayerId === playerId && "(You)"}
              </div>
            </div>
          );
        })}
        <div>
          {game.gameState.readyToStart ? (
            <p>
              {game.gameState.timer >= 0 &&
                `Game starts in: ${game.gameState.timer} seconds`}
            </p>
          ) : (
            <>
              <p>Waiting for more players....</p>
              {game.players[game.yourPlayerId].avatarUrl && (
                <img
                  src={game.players[game.yourPlayerId].avatarUrl}
                  alt="Player Avatar"
                  hidden
                />
              )}
            </>
          )}
        </div>
      </div>
    );

  return (
    <>
      {/* <button
        onClick={() => {
          playAnimation("allPassRight");
        }}
      >
        CLICK Me
      </button> */}
      {configureGameStateUI}
    </>
  );
}

export default App;

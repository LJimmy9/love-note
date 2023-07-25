import { useEffect, useState } from "react";
import "./App.css";
import Game from "./components/Game";
import LocationPin from "./components/LocationPin.tsx";
import Overlay from "./components/Overlay.tsx";
import { useAtom } from "jotai";
import { $game } from "./state/game.ts";

function App() {
  const [game, setGame] = useAtom($game);
  const [pinPos, setPinPos] = useState<number[]>([]);

  useEffect(() => {
    Rune.initClient({
      onChange: ({ newGame, yourPlayerId, players }) => {
        setGame({
          gameState: newGame,
          players: players,
          yourPlayerId: yourPlayerId ? yourPlayerId : "",
        });
        console.log("onchange check", newGame);
      },
    });
  }, []);

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
        <Game
          player={game.gameState.players[game.yourPlayerId]}
          pinPos={pinPos}
        />
        <LocationPin location={"center"} handlePos={(pos) => setPinPos(pos)} />
        {/* Conditionally render the overlay based on showOverlay state */}
        <Overlay
          Name={game.players[game.yourPlayerId].displayName}
          Avatar={game.players[game.yourPlayerId].avatarUrl}
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
            "Waiting for more players...."
          )}
        </div>
      </div>
    );

  return <>{configureGameStateUI}</>;
}

export default App;

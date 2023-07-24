import { useEffect, useState } from "react";
import "./App.css";
import { GameState } from "./logic.ts";
import { Players } from "rune-games-sdk/multiplayer";
import Game from "./components/Game";
import LocationPin from "./components/LocationPin.tsx";
import Overlay from "./components/Overlay.tsx";

function App() {
  const [game, setGame] = useState<GameState>();
  const [allPlayers, setAllPlayers] = useState<Players>({});
  const [currPlayerId, setCurrPlayerId] = useState("");

  const [pinPos, setPinPos] = useState<number[]>([]);

  useEffect(() => {
    Rune.initClient({
      onChange: ({ newGame, yourPlayerId, players }) => {
        setAllPlayers(players);
        if (yourPlayerId && !currPlayerId) {
          setCurrPlayerId(yourPlayerId);
        }
        setGame({ ...newGame });
      },
    });
  }, []);

  useEffect(() => {
    if (!game || Object.keys(game.players).includes(currPlayerId)) return;
    Rune.actions.login({ displayName: allPlayers[currPlayerId].displayName });
  }, [allPlayers, game, currPlayerId]);

  const configureGameStateUI =
    game &&
    (game.started ? (
      <div
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#fbd9bb",
        }}
      >
        <Game game={game} player={game.players[currPlayerId]} pinPos={pinPos} />
        <LocationPin location={"center"} handlePos={(pos) => setPinPos(pos)} />
        {/* Conditionally render the overlay based on showOverlay state */}
        <Overlay Name={game.players[currPlayerId].displayName} Avatar={game.players[currPlayerId].avatarUrl} />
      </div>
    ) : (
      <div>
        {Object.keys(game.players).map((playerId, idx) => {
          return (
            <div key={playerId + idx}>
              <div key={idx}>
                {game.players[playerId].displayName}{" "}
                {currPlayerId === playerId && "(You)"}
              </div>
            </div>
          );
        })}
        <div>
          {game && game.readyToStart ? (
            <p>
              {game &&
                game.timer >= 0 &&
                `Game starts in: ${game.timer} seconds`}
            </p>
          ) : (
            "Waiting for more players...."
          )}
        </div>
      </div>
    ));

  if (!game) {
    return <div>Loading...</div>;
  }

  return <>{configureGameStateUI}</>;
}

export default App;

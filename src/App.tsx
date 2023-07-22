import { useEffect, useState } from "react";
import "./App.css";
import { GameState } from "./logic.ts";
import { Players } from "rune-games-sdk/multiplayer";
import Game from "./components/Game";

function App() {
  const [game, setGame] = useState<GameState>();
  const [allPlayers, setAllPlayers] = useState<Players>({});
  const [currPlayerId, setCurrPlayerID] = useState("");

  useEffect(() => {
    Rune.initClient({
      onChange: ({ newGame, yourPlayerId, players }) => {
        setGame({ ...newGame });
        if (Object.keys(newGame.players).length != Object.keys(players).length) {
          setAllPlayers({ ...players });
        }
        if (yourPlayerId) setCurrPlayerID(yourPlayerId);
      },
    });
  }, []);

  useEffect(() => {
    Rune.actions.updatePlayers({ player: allPlayers[currPlayerId] });
  }, [currPlayerId]);

  if (!game) {
    return <div>Loading...</div>;
  }

  const configureGameStateUI =
    game && game.readyToStart ? (
      // show countdown
      <div></div>
    ) : game.started ? (
      // show game
      <Game />
    ) : (
      // else show lobby
      <div>
        {Object.keys(game.players).map((playerId, idx) => {
          return (
            <div key={playerId + idx}>
              <div key={idx}>{game.players[playerId].displayName}</div>
            </div>
          );
        })}
        <p>Waiting for more players....</p>
      </div>
    );

  return <>{configureGameStateUI}</>;
}

export default App;

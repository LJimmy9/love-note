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
        if (
          Object.keys(newGame.players).length != Object.keys(players).length
        ) {
          setAllPlayers({ ...players });
        }
        if (yourPlayerId) setCurrPlayerID(yourPlayerId);
      },
    });
  }, []);

  useEffect(() => {
    Rune.actions.updatePlayers({ player: allPlayers[currPlayerId] });
  }, [currPlayerId]);

  useEffect(() => {
    if (game && game.timer === 0) {
      Rune.actions.startGame();
    }
  }, [game]);

  const timerDisplay = (
    <div>
      {game && game.timer >= 0 && `Game starts in: ${game.timer} seconds`}
    </div>
  );

  const configureGameStateUI =
    game &&
    (game.started ? (
      <Game />
    ) : (
      <div>
        {Object.keys(game.players).map((playerId, idx) => {
          return (
            <div key={playerId + idx}>
              <div key={idx}>{game.players[playerId].displayName}</div>
            </div>
          );
        })}
        <div>
          {game && game.readyToStart ? (
            <p>{timerDisplay}</p>
          ) : (
            "Waiting for more players...."
          )}
        </div>
      </div>
    ));

  // const configureGameStateUI =
  //   game && game.readyToStart ? (
  //     // show countdown
  //     <div>{timerDisplay}</div>
  //   ) : game?.started ? (
  //     // show game
  //     <Game />
  //   ) : (
  //     // else show lobby
  //     <div>
  //       { game && Object.keys(game.players).map((playerId, idx) => {
  //         return (
  //           <div key={playerId + idx}>
  //             <div key={idx}>{game?.players[playerId].displayName}</div>
  //           </div>
  //         );
  //       })}
  //       <p>Waiting for more players....</p>
  //     </div>
  //   );

  if (!game) {
    return <div>Loading...</div>;
  }

  return <>{configureGameStateUI}</>;
}

export default App;

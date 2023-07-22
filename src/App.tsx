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
      Rune.actions.distributeDeckAndIdCards();
      Rune.actions.startGame();
    }
  }, [game]);

  // const timerDisplay = (
  //   <div>
  //     {game && game.timer >= 0 && `Game starts in: ${game.timer} seconds`}
  //   </div>
  // );

  // const configureGameStateUI =
  //   game &&
  //   (game.started ? (
  //     <Game game={game} />
  //   ) : (
  //     <div>
  //       {Object.keys(game.players).map((playerId, idx) => {
  //         return (
  //           <div key={playerId + idx}>
  //             <div key={idx}>{game.players[playerId].displayName}</div>
  //           </div>
  //         );
  //       })}
  //       <div>
  //         {game && game.readyToStart ? (
  //           <p>{timerDisplay}</p>
  //         ) : (
  //           "Waiting for more players...."
  //         )}
  //       </div>
  //     </div>
  //   ));

  if (!game) {
    return <div>Loading...</div>;
  }

  // return <>{configureGameStateUI}</>;
  return (
    // <div className={`${gf.gameContainer}`}>
    <div
      style={{
        position: "relative",
        border: "10px solid blue",
        height: "90vh",
        overflow: "hidden",
      }}
    >
      <Game game={game} player={game.players[currPlayerId]} />
      <div
        style={{
          position: "absolute",
          color: "black",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: "1",
        }}
      >
        this is the center
      </div>
    </div>
  );
}

export default App;

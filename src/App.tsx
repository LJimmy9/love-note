import { useEffect, useState } from "react";
import "./App.css";
import { GameState } from "./logic.ts";
import { Players } from "rune-games-sdk/multiplayer";
import Game from "./components/Game";
import LocationPin from "./components/LocationPin.tsx";

function App() {
  const [game, setGame] = useState<GameState>();
  const [allPlayers, setAllPlayers] = useState<Players>({});
  const [currPlayerId, setCurrPlayerID] = useState("");

  const [pinPos, setPinPos] = useState<number[]>([]);

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
        border: "5px solid blue",
        height: "100vh",
        overflow: "hidden",
        // backgroundColor: "#89CFF0",
        backgroundColor: "#89CFF0",
      }}
    >
      <Game game={game} player={game.players[currPlayerId]} pinPos={pinPos} />
      <LocationPin location={"center"} handlePos={(pos) => setPinPos(pos)} />
    </div>
  );
}

export default App;

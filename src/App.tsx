import { useEffect, useState } from "react";
import reactLogo from "./assets/rune.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { GameState } from "./logic.ts";
import { Players } from "rune-games-sdk/multiplayer";
import Game from "./components/Game";

function App() {
  const [game, setGame] = useState<GameState>();
  const [playerInfo, setPlayerInfo] = useState({
    displayName: "",
    avatar: "",
  });
  const [allPlayers, setAllPlayers] = useState<Players>();
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [anyPlayerInRoom, setAnyPlayerInRoom] = useState<boolean>(false);
  const [currPlayerId, setCurrPlayerId] = useState<string>("");
  const [currentAdminId, setCurrentAdminId] = useState<string>("");

  useEffect(() => {
    Rune.initClient({
      onChange: ({ newGame, yourPlayerId, players }) => {
        setGame({ ...newGame });
        if (yourPlayerId) {
          setPlayerInfo({
            displayName: players[yourPlayerId].displayName,
            avatar: players[yourPlayerId].avatarUrl,
          });
          setCurrPlayerId(yourPlayerId);
        }
        setAllPlayers(players);
      },
    });
  }, []);

  // Refactor if allow: try to see if we can remove the enterWaitingRoom logic
  // and instead have all player info be added to AllPlayers object when a user enters
  // enterWaitingRoom logic feels redundant
  useEffect(() => {
    if (game && !anyPlayerInRoom) {
      Rune.actions.enterWaitingRoom();
      setAnyPlayerInRoom(true);
    }
  }, [game]);

  useEffect(() => {
    if (!allPlayers) setAnyPlayerInRoom(false);
  }, [anyPlayerInRoom]);

  useEffect(() => {
    Rune.actions.updatePlayerInfo({
      playerName: playerInfo.displayName,
      avatar: playerInfo.avatar,
    });
  }, [playerInfo]);

  // useEffect(() => {
  //   if (game && !gameStart && playerInfo) {
  //     Rune.actions.addPlayer({
  //       playerName: playerInfo.displayName,
  //       avatar: playerInfo.avatar,
  //     });
  //   }
  // }, [game, playerInfo]);

  useEffect(() => {
    console.log("game in usestate", game);
  }, [game]);

  if (!game) {
    return <div>Loading...</div>;
  }

  const configureGameStateUI = gameStart ? (
    <Game />
  ) : (
    <div>
      {game &&
        Object.keys(game.players).map((playerId, idx) => {
          // console.log("game", game);
          const { displayName, avatarUrl, isAdmin } = game?.players[playerId];
          // console.log("player", player);
          // console.log("game", game);
          // console.log("displayName", displayName);
          return (
            <div>
              <div key={idx}>
                {currPlayerId === playerId ? "You" : displayName}
              </div>
            </div>
          );
        })}
      <div>
        {Object.keys(game.players).length >= 4
          ? "Start Game"
          : "Waiting for more players ...."}
      </div>
    </div>
  );

  // const playerCurrentUI = ()

  // if admin -> have access to start game button
  // else -> other players sees different UI
  return <>{configureGameStateUI}</>;
}

export default App;

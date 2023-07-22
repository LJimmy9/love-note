import { useEffect, useState } from "react";
import reactLogo from "./assets/rune.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { GameState } from "./logic.ts";
import { Players } from "rune-games-sdk/multiplayer";

function App() {
  const [game, setGame] = useState<GameState>();
  const [playerInfo, setPlayerInfo] = useState({
    displayName: "",
    avatar: "",
  });
  const [allPlayers, setAllPlayers] = useState<Players>();
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [anyPlayer, setAnyPlayer] = useState<boolean>(false);

  useEffect(() => {
    Rune.initClient({
      onChange: ({ newGame, yourPlayerId, players }) => {
        setGame({ ...newGame });
        if (yourPlayerId)
          setPlayerInfo({
            displayName: players[yourPlayerId].displayName,
            avatar: players[yourPlayerId].avatarUrl,
          });
        setAllPlayers(players);
      },
    });
  }, []);

  // Refactor if allow: try to see if we can remove the enterWaitingRoom logic
  // and instead have all player info be added to AllPlayers object when a user enters
  // enterWaitingRoom logic feels redundant
  useEffect(() => {
    if (game && !anyPlayer) {
      Rune.actions.enterWaitingRoom();
      setAnyPlayer(true);
    }
  }, [game]);

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

  // const displayGameState = () => {};

  // if admin -> have access to start game button
  // else -> other players sees different UI
  return <div>Hey</div>;
}

export default App;

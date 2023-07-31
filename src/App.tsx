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

  const configureGameStateUI = (
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
  );

  return <>{configureGameStateUI}</>;
}

export default App;

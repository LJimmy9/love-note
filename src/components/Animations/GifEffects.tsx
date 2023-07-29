import { useAtomValue } from "jotai";
import { $gameState, $players, $runePlayer } from "../../state/game";
import magnifyingGlass from "../../../src/assets/magnifying_glass.gif";
import ge from "./GifEffects.module.css";

function GifEffects() {
  const gameState = useAtomValue($gameState);
  const players = useAtomValue($players);
  const curPlayer = useAtomValue($runePlayer);

  return (
    gameState.gamePhase == "Resolve" &&
    gameState.currentTurn != curPlayer.playerId && (
      <>
        <div className={`${ge.bannerText}`}>
          <div className={`${ge.text}`}>
            {`${players && players[gameState.currentTurn].displayName} played ${
              gameState.cardPlayed
            }`}
          </div>
        </div>
        {gameState.cardPlayed != "Pass Direction" &&
          gameState.cardPlayed != "Trade Snacks" && (
            <img
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                translate: "-50% -50%",
                height: "50%",
                width: "50%",
                zIndex: "2",
              }}
              src={magnifyingGlass}
            />
          )}
      </>
    )
  );
}

export default GifEffects;

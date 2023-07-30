import od from "../CardAction/OppositeDay.module.css";
import { $gameState, $runePlayer } from "../../state/game";
import { useAtomValue } from "jotai";
import drunk from "../../assets/drunk.gif";

const OppositeDaySideEffect = () => {
  const currPlayer = useAtomValue($runePlayer);
  const gameState = useAtomValue($gameState);

  return (
    <div>
      <div
        className={od.oppositeContainer}
        onAnimationEnd={() => {
          if (currPlayer.playerId !== gameState.currentTurn) return;
          Rune.actions.updateCurrentTurn();
        }}
        style={{
          zIndex: "10",
          translate: "0 10vh",
        }}
      >
        <p
          style={{ textAlign: "left" }}
        >{`It's opposite day! Card swapping is now ${gameState.priority} card to the ${gameState.direction}.`}</p>
      </div>
      <img
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          translate: "-50% -50%",
          height: "100%",
          width: "100%",
          zIndex: "2",
        }}
        src={drunk}
      />
    </div>
  );
};

export default OppositeDaySideEffect;

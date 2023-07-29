import { useAtomValue } from "jotai";
import { $gameState, $runePlayer } from "../../state/game";
import { TattleProps } from "../CardAction/Tattle";
import a from "./AbsentSideEffect.module.css";

function AbsentSideEffect({ players }: TattleProps) {
  const gameState = useAtomValue($gameState);
  const currPlayer = useAtomValue($runePlayer);

  return (
    <div className={a.info}>
      {players[gameState.tattledOn].displayName} was absent! The teacher did not
      believe they were passing notes.
    </div>
  );
}

export default AbsentSideEffect;

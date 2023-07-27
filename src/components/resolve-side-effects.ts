import { PlayerId } from "rune-games-sdk/multiplayer";
import { GameState } from "../logic";
import { updateCurrentTurn } from "../game-setup";

export function resolve3(game: GameState) {
  const playerIds = Object.keys(game.players);
  const playersWithActiveSideEffect: Array<PlayerId> = playerIds
    .filter((playerId) => {
      const player = game.players[playerId];
      return player.sideEffect && player.sideEffect.active === true;
    })
    .map((playerId) => playerId);

  if (
    Object.keys(game.cardSwapSetup).length !==
    playersWithActiveSideEffect.length
  )
    return;

  for (let i = 0; i < playersWithActiveSideEffect.length; i++) {
    const playerId = playersWithActiveSideEffect[i];
    game.players[playerId].playerHand.push(
      game.cardSwapSetup[game.players[playerId].sideEffect.receiveFrom]
    );
  }

  for (let i = 0; i < playersWithActiveSideEffect.length; i++) {
    const playerId = playersWithActiveSideEffect[i];

    game.players[playerId].playerHand = game.players[
      playerId
    ].playerHand.filter((card) => card.id != game.cardSwapSetup[playerId].id);
    game.players[playerId].sideEffect.active = false;
    game.players[playerId].sideEffect.selectedCard = null;
  }

  game.animation = "passLeft";

  updateCurrentTurn(game);
}

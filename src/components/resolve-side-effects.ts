import { PlayerId } from "rune-games-sdk/multiplayer";
import { GameState } from "../logic";
import { updateCurrentTurn } from "../game-setup";

function getPlayersWithActiveSideEffect(game: GameState) {
  const playerIds = Object.keys(game.players);
  const playersWithActiveSideEffect: Array<PlayerId> = playerIds
    .filter((playerId) => {
      const player = game.players[playerId];
      return player.sideEffect && player.sideEffect.active === true;
    })
    .map((playerId) => playerId);

  return playersWithActiveSideEffect;
}

export function resolve(game: GameState) {
  const playersWithActiveSideEffect = getPlayersWithActiveSideEffect(game);

  // if not everyone involved has selected a card, return
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
    game.players[playerId].sideEffect.active = false;
  }

  game.gamePhase = "Processing";
}

export function resolveProcessing(game: GameState) {
  if (game.gamePhase == "Processing") {
    const allPlayers = Object.keys(game.players);
    for (let i = 0; i < allPlayers.length; i++) {
      if (game.players[allPlayers[i]].playerHand.length != 3) continue;
      const playerId = allPlayers[i];
      game.players[playerId].playerHand = game.players[
        playerId
      ].playerHand.filter((card) => card.id != game.cardSwapSetup[playerId].id);
      game.players[playerId].sideEffect.active = false;
      game.players[playerId].sideEffect.selectedCard = null;
      game.players[playerId].sideEffect.receiveFrom = "";
    }
    updateCurrentTurn(game);
  }
}

function getPlayerToReceiveFrom(
  game: GameState,
  playerId: PlayerId,
  direction: string
) {
  const totalPlayers = 3;
  const allPlayerIds = Object.keys(game.players);
  const currPlayerIdx = allPlayerIds.indexOf(playerId);
  let playerIdxToReceiveFrom =
    direction === "left" ? currPlayerIdx + 1 : currPlayerIdx - 1;

  if (playerIdxToReceiveFrom > totalPlayers) {
    playerIdxToReceiveFrom = 0;
  } else if (playerIdxToReceiveFrom < 0) {
    playerIdxToReceiveFrom = 3;
  }

  return Object.keys(game.players)[playerIdxToReceiveFrom];
}

export function setReceiveFrom(game: GameState, playerId: PlayerId) {
  const receiveFromPlayerId = getPlayerToReceiveFrom(game, playerId, "left");
  game.players[playerId].sideEffect.receiveFrom = receiveFromPlayerId;
}

import { atom } from "jotai";
import { Players, PlayerId, Player } from "rune-games-sdk/multiplayer";
import { GameState, Phase } from "../logic";

export const $game = atom<
  | {
      gameState: GameState;
      players: Players;
      yourPlayerId: PlayerId;
    }
  | undefined
>(undefined);

export const $players = atom((get) => get($game)?.players);

export const $runePlayer = atom<Player>((get) => {
  const game = get($game);
  if (!game || !game.yourPlayerId) {
    return {
      playerId: "" as PlayerId,
      displayName: "",
      avatarUrl: "",
    };
  } else {
    return game.players[game.yourPlayerId];
  }
});

export const $gamePhase = atom<Phase>((get) => {
  const game = get($game);
  if (!game) {
    return "Default" as Phase;
  }
  {
    return game.gameState.gamePhase as Phase;
  }
});

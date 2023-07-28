import { atom } from "jotai";
import { Players, PlayerId, Player } from "rune-games-sdk/multiplayer";
import { GameState, Phase } from "../logic";

export interface AtomPlayer {
  playerId: PlayerId;
  displayName: string;
  avatarUrl: string;
}

export const $game = atom<
  | {
      gameState: GameState;
      players: Players;
      yourPlayerId: PlayerId;
    }
  | undefined
>(undefined);

export const $gameState = atom<GameState>((get) => {
  const game = get($game);
  if (!game) {
    const gameState: GameState = {
      readyToStart: false,
      started: false,
      players: {},
      timer: 2,
      deck: [],
      identityCards: [],
      discardedCards: [],
      currentTurn: "",
      loveNotes: [],
      turnNum: 0,
      gamePhase: "Draw",
      direction: "right",
      priority: "highest",
      cardSwapSetup: {},
      animation: "",
      rainyDayIsPlay: false,
    };
    return gameState;
  } else {
    return game.gameState;
  }
});
export const $players = atom((get) => get($game)?.players);
export const $runePlayer = atom<Player>((get) => {
  const game = get($game);
  if (!game || !game.yourPlayerId) {
    const atomPlayer: AtomPlayer = {
      playerId: "" as PlayerId,
      displayName: "",
      avatarUrl: "",
    };
    return atomPlayer;
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

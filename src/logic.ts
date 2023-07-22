import type { RuneClient, Player } from "rune-games-sdk/multiplayer";

export interface Card {
  id: string;
  image: string;
  cardNum: number;
  description: string;
  restrictionToPlayer: string;
}

export interface GamePlayer {
  playerId: string;
  displayName: string;
  avatarUrl: string;
  playerIdentity: string;
  playerHand: Card[] | [];
}

export interface AllPlayers {
  [key: string]: GamePlayer;
}

export interface GameState {
  readyToStart: boolean;
  started: boolean;
  players: AllPlayers;
  timer: number;
}

type GameActions = {
  updatePlayers: (params: { player: Player }) => void;
  startGame: () => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 6,
  setup: (): GameState => {
    return {
      readyToStart: false,
      started: false,
      players: {},
      timer: 30,
    };
  },
  update: ({ game }) => {
    if (Object.keys(game.players).length >= 4) {
      game.readyToStart = true;
    }

    if (game.readyToStart && game.timer > 0) {
      game.timer -= 1;
    }
  },
  actions: {
    updatePlayers: ({ player }, { game }) => {
      game.players[player.playerId] = {
        ...player,
        playerIdentity: "",
        playerHand: [],
      };
    },
    startGame: (_, { game }) => {
      game.started = true;
    },
  },
  events: {
    playerJoined: () => {},
    playerLeft() {},
  },
});

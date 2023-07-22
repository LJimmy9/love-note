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
}

type GameActions = {
  updatePlayers: (params: { player: Player }) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 6,
  setup: (): GameState => {
    return { readyToStart: false, started: false, players: {} };
  },
  update: ({ game }) => {
    if (Object.keys(game.players).length >= 4) game.readyToStart = true;
  },
  actions: {
    updatePlayers: ({ player }, { game }) => {
      game.players[player.playerId] = {
        ...player,
        playerIdentity: "",
        playerHand: [],
      };
    },
  },
  events: {
    playerJoined: () => {},
    playerLeft() {},
  },
});

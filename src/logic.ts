import type { RuneClient } from "rune-games-sdk/multiplayer";

export interface Card {
  id: string;
  image: string;
  cardNum: number;
  description: string;
  restrictionToPlayer: string;
}

export interface Player {
  id: string;
  displayName: string;
  avatarUrl: string;
  playerIdentity: string;
  playerHand: Card[];
  isAdmin: boolean;
}

export interface AllPlayers {
  [key: string]: Player;
}

export interface GameState {
  count: number;
  players: AllPlayers;
  // TODO: set logic up later if admin leaves game
  adminID: string;
}

type GameActions = {
  increment: (params: { amount: number }) => void;
  enterWaitingRoom: () => void;
  // addPlayer: (params: { playerName: string; avatar: string }) => void;
  updatePlayerInfo: (params: { playerName: string; avatar: string }) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

export function getCount(game: GameState) {
  return game.count;
}

export function addPlayer(game: GameState, playerId: string) {
  const player: Player = {
    ...game.players[playerId],
    displayName: "",
    avatarUrl: "",
    playerIdentity: "",
    playerHand: [],
    isAdmin: game.count === 0 ? true : false,
    id: playerId,
  };

  game.players[playerId] = player;
}

Rune.initLogic({
  // for some reason phone automatically adds 4 phones even though there are no players yet
  // for now: we'll set minPlayers to 1 and create the conditional logic on frontend to allow players to start the game
  minPlayers: 1,
  maxPlayers: 6,
  setup: (): GameState => {
    return { count: 0, players: {}, adminID: "" };
  },
  actions: {
    increment: ({ amount }, { game }) => {
      game.count += amount;
    },

    enterWaitingRoom: (_, { game, playerId }) => {
      addPlayer(game, playerId);
      game.count += 1;
    },

    updatePlayerInfo: ({ playerName, avatar }, { game, playerId }) => {
      // console.log("game.players[playerId]", game.players[playerId]);
      game.players[playerId].displayName = playerName;
      game.players[playerId].avatarUrl = avatar;
      // game.players[playerId].isAdmin = game.count === 1 ? true : false;
    },
  },
  events: {
    playerJoined: () => {
      // Handle player joined
    },
    playerLeft() {
      // Handle player left
    },
  },
});

import type { RuneClient, Player } from "rune-games-sdk/multiplayer";
import {
  distributeCards,
  setCurrentTurn,
  setupDeck,
  setupIdentityCards,
} from "./game-setup";

export interface Card {
  id: string;
  name: string;
  image: string;
  cardNum: number;
  description: string;
  restrictionToRole: string;
  count: number;
}

export interface IdentityCard {
  name: string;
  image: string;
  description: string;
}

export interface GamePlayer {
  playerId: string;
  displayName: string;
  avatarUrl: string;
  playerIdentity: IdentityCard;
  playerHand: Card[];
}

export interface AllPlayers {
  [key: string]: GamePlayer;
}

export interface Note {
  id: string;
  text: string;
}

export interface GameState {
  readyToStart: boolean;
  started: boolean;
  players: AllPlayers;
  timer: number;
  deck: Array<Card>;
  identityCards: Array<IdentityCard>;
  currentTurn: string;
  loveNotes: Array<Note>;
}

type GameActions = {
  updatePlayers: (params: { player: Player }) => void;
  startGame: () => void;
  distributeDeckAndIdCards: () => void;
  updateLoveNote: (params: { action: string }) => void;
  getLoveNotes: () => Array<Note>;
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
      timer: 2,
      deck: setupDeck(),
      identityCards: setupIdentityCards(),
      currentTurn: "",
      loveNotes: [],
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
    // gets
    getLoveNotes: (_, { game }) => {
      return game.loveNotes;
    },

    // updates
    updatePlayers: ({ player }, { game }) => {
      const idCard: IdentityCard = { name: "", image: "", description: "" };
      game.players[player.playerId] = {
        ...player,
        playerIdentity: idCard,
        playerHand: [],
      };
    },
    updateLoveNote: ({ action }, { game }) => {
      switch (action) {
        case "add":
          break;
        case "remove":
          break;
        default:
          console.log("no action");
      }
    },

    // actions
    startGame: (_, { game }) => {
      game.started = true;
    },
    distributeDeckAndIdCards: (_, { game }) => {
      distributeCards(game);
      setCurrentTurn(game);
    },
  },
  events: {
    playerJoined: () => {
      // handle player joined
    },
    playerLeft() {
      // handle player left
    },
  },
});

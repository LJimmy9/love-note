import type { RuneClient, Player } from "rune-games-sdk/multiplayer";
import {
  setupDeck,
  setupIdentityCards,
  distributeCards,
  setCurrentTurn,
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
  turnNum: number;
  discardedCards: Array<Card>;
}

type GameActions = {
  updatePlayers: (params: { player: Player }) => void;
  startGame: () => void;
  distributeDeckAndIdCards: () => void;
  drawCard: (params: { deckCard: Card; playerId: string }) => void;
  updateLoveNote: (params: { action: string }) => void;
  getLoveNotes: () => Array<Note>;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 2,
  setup: (): GameState => {
    return {
      readyToStart: false,
      started: false,
      players: {},
      timer: 2,
      deck: setupDeck(),
      identityCards: setupIdentityCards(),
      discardedCards: [],
      currentTurn: "",
      loveNotes: [],
      turnNum: 0,
    };
  },
  update: ({ game }) => {
    if (Object.keys(game.players).length >= 2) {
      game.readyToStart = true;
    }

    if (game.readyToStart && game.timer > 0) {
      game.timer -= 1;
    }

    if (game && game.timer === 0 && !game.started) {
      distributeCards(game);
      setCurrentTurn(game);
      game.started = true;
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
    updateLoveNote: ({ action }) => {
      switch (action) {
        case "add":
          break;
        case "remove":
          break;
        default:
      }
    },

    // actions
    startGame: (_, { game }) => {
      game.started = true;
    },
    distributeDeckAndIdCards: (_, { game }) => {
      distributeCards(game);
    },
    drawCard: ({ deckCard, playerId }, { game }) => {
      if (
        game.players[playerId].playerHand.length >= 3 ||
        game.currentTurn != playerId
      ) {
        return;
      }
      game.players[playerId].playerHand.push(deckCard);
      game.deck = game.deck.filter((card) => card.id !== deckCard.id);
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

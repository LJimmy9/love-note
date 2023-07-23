import type { RuneClient, Player } from "rune-games-sdk/multiplayer";
import {
  setupDeck,
  setupIdentityCards,
  getDistributedCards,
  setInitialTurn,
  updateCurrentTurn,
  getReshuffledDeck,
} from "./game-setup";

export interface Card {
  id: string;
  name: string;
  image: string;
  cardNum: number;
  description: string;
  restrictionToRole: string;
  count: number;
  canPlay: boolean;
}

export interface IdentityCard {
  name: string;
  image: string;
  description: string;
  role: string;
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
  id: number;
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
  // gets
  getLoveNotes: () => Array<Note>;

  // updates
  updatePlayers: (params: { player: Player }) => void;
  updateLoveNote: (params: { action: string; prompt: string }) => void;

  // actions
  startGame: () => void;
  drawCard: (params: { deckCard: Card; playerId: string }) => void;
  playCard: (params: { playCard: Card; playerId: string }) => void;
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

    if (game.readyToStart && game.timer > 0 && !game.started) {
      game.timer -= 1;
    }

    if (game && game.timer === 0 && !game.started) {
      const distributedCards = getDistributedCards(game);
      if (!distributedCards) return;

      game.deck = distributedCards.deck;
      game.players = distributedCards.players;
      game.currentTurn = setInitialTurn(game);
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
      const idCard: IdentityCard = {
        name: "",
        image: "",
        description: "",
        role: "",
      };
      game.players[player.playerId] = {
        ...player,
        playerIdentity: idCard,
        playerHand: [],
      };
    },
    updateLoveNote: ({ action, prompt }, { game }) => {
      switch (action) {
        case "add":
          game.loveNotes.push({
            id: game.loveNotes.length,
            text: prompt,
          });
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
    drawCard: ({ deckCard, playerId }, { game }) => {
      if (
        game.players[playerId].playerHand.length >= 3 ||
        game.currentTurn != playerId ||
        !game.started
      ) {
        return;
      }
      game.players[playerId].playerHand.push(deckCard);
      const deckCopy = [...game.deck];
      game.deck = deckCopy.filter((card) => card.id !== deckCard.id);
    },
    playCard: ({ playCard, playerId }, { game }) => {
      const playerHand = game.players[playerId].playerHand;
      if (playerHand.length < 3 || game.currentTurn != playerId) {
        return;
      }
      game.discardedCards.push(playCard);
      game.players[playerId].playerHand = playerHand.filter(
        (card) => card.id !== playCard.id
      );

      // Reshuffle discard pile into the deck
      if (game.deck.length <= 0) {
        game.deck = getReshuffledDeck(game);
        game.discardedCards = [];
      }
      updateCurrentTurn(game);
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

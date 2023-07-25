import type { RuneClient } from "rune-games-sdk/multiplayer";
import {
  setupDeck,
  setupIdentityCards,
  updateCurrentTurn,
  getReshuffledDeck,
  createPlayer,
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
  playerIdentity: IdentityCard;
  playerHand: Card[];
  connected: boolean;
}

export interface AllPlayers {
  [key: string]: GamePlayer;
}

export interface Note {
  id: number;
  text: string;
}

export type Phase = "Draw" | "Play" | "Resolve" | "Default";

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
  gamePhase: Phase;
}

type GameActions = {
  // gets
  getLoveNotes: () => Array<Note>;
  // updates
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
  setup: (allPlayerIds): GameState => {
    const deck = setupDeck();
    const identityCards = setupIdentityCards();
    const players: AllPlayers = {};

    for (let i = 0; i < allPlayerIds.length; i++) {
      players[allPlayerIds[i]] = createPlayer(identityCards, deck);
    }

    return {
      readyToStart: false,
      started: false,
      players: players,
      timer: 2,
      deck: deck,
      identityCards: identityCards,
      discardedCards: [],
      currentTurn: allPlayerIds[0],
      loveNotes: [],
      turnNum: 0,
      gamePhase: "Draw",
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
      game.started = true;
    }
  },
  actions: {
    // gets
    getLoveNotes: (_, { game }) => {
      return game.loveNotes;
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
    startGame: (_, { game }) => {
      game.started = true;
    },
    drawCard: ({ deckCard, playerId }, { game }) => {
      if (
        game.players[playerId].playerHand.length >= 3 ||
        game.currentTurn != playerId
      ) {
        throw Rune.invalidAction();
      }
      const playerHandCopy = [...game.players[playerId].playerHand];
      playerHandCopy.push(deckCard);
      game.players[playerId].playerHand = playerHandCopy;
      const deckCopy = [...game.deck];

      const newDeck: Array<Card> = [];
      for (let i = 0; i < deckCopy.length; i++) {
        if (deckCopy[i].id !== deckCard.id) {
          newDeck.push(deckCopy[i]);
        }
      }
      game.deck = newDeck;
      game.gamePhase = "Play";
    },
    playCard: ({ playCard, playerId }, { game }) => {
      const playerHand = [...game.players[playerId].playerHand];
      if (playerHand.length != 3 || game.currentTurn != playerId) {
        throw Rune.invalidAction();
      }

      game.discardedCards.push(playCard);
      const newPlayerHand: Array<Card> = [];
      for (let i = 0; i < playerHand.length; i++) {
        if (playerHand[i].id !== playCard.id) {
          newPlayerHand.push(playerHand[i]);
        }
      }

      game.players[playerId].playerHand = newPlayerHand;
      // Reshuffle discard pile into the deck
      if (game.deck.length <= 0) {
        game.deck = getReshuffledDeck(game);
        game.discardedCards = [];
      }
      updateCurrentTurn(game);
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      if (Object.keys(game.players).includes(playerId)) {
        game.players[playerId].connected = true;
        return;
      }
      game.players[playerId] = createPlayer(game.identityCards, game.deck);
    },
    playerLeft(playerId, { game }) {
      game.players[playerId].connected = false;
    },
  },
});

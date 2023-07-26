import type { Player, PlayerId, RuneClient } from "rune-games-sdk/multiplayer";
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

export interface SideEffect {
  active: boolean;
  cardNum: number;
}

export interface GamePlayer {
  playerIdentity: IdentityCard;
  playerHand: Card[];
  connected: boolean;
  sideEffect: SideEffect;
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
  direction: string;
}

type GameActions = {
  // gets
  getLoveNotes: () => Array<Note>;
  // updates
  updateLoveNote: (params: { action: string; prompt: string }) => void;
  updateCurrentTurn: () => void;
  // actions
  startGame: () => void;
  drawCard: (params: { deckCard: Card; playerIdToUpdate: string }) => void;
  playCard: (params: { playCard: Card; playerIdToUpdate: string }) => void;
  handleCard: (params: {
    cardNum: number;
    playersInvolved: Array<PlayerId>;
  }) => void;
  resolveCard: () => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

function handleCard(
  cardNum: number,
  playersInvolved: Array<PlayerId>,
  game: GameState
) {
  // handle card logic for each card
  switch (cardNum) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      for (let i = 0; i < playersInvolved.length; i++) {
        const playerId = playersInvolved[i];
        console.log("playerId", playerId);
        game.players[playerId].sideEffect.active = true;
        game.players[playerId].sideEffect.cardNum = 3;
      }
      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      break;
    case 7:
      break;
    case 8:
      break;
  }
}

Rune.initLogic({
  minPlayers: 4,
  maxPlayers: 4,
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
      direction: "right",
    };
  },
  update: ({ game }) => {
    if (Object.keys(game.players).length >= 4) {
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
          game.loveNotes = game.loveNotes.filter((note) => note.text != prompt);
          break;
        default:
          break;
      }
    },
    startGame: (_, { game }) => {
      game.started = true;
    },
    drawCard: ({ deckCard, playerIdToUpdate }, { game }) => {
      if (
        game.players[playerIdToUpdate].playerHand.length >= 3 ||
        game.currentTurn != playerIdToUpdate
      ) {
        throw Rune.invalidAction();
      }
      const playerHandCopy = [...game.players[playerIdToUpdate].playerHand];
      playerHandCopy.push(deckCard);
      game.players[playerIdToUpdate].playerHand = playerHandCopy;
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
    playCard: ({ playCard, playerIdToUpdate }, { game }) => {
      const playerHand = [...game.players[playerIdToUpdate].playerHand];
      if (playerHand.length != 3 || game.currentTurn != playerIdToUpdate) {
        throw Rune.invalidAction();
      }

      game.discardedCards.push(playCard);
      const newPlayerHand: Array<Card> = [];
      for (let i = 0; i < playerHand.length; i++) {
        if (playerHand[i].id !== playCard.id) {
          newPlayerHand.push(playerHand[i]);
        }
      }

      game.players[playerIdToUpdate].playerHand = newPlayerHand;
      // Reshuffle discard pile into the deck if deck has been exhausted
      if (game.deck.length <= 0) {
        game.deck = getReshuffledDeck(game);
        game.discardedCards = [];
      }

      game.gamePhase = "Resolve";
    },
    updateCurrentTurn: (_, { game }) => {
      updateCurrentTurn(game);
      game.gamePhase = "Draw";
    },
    handleCard: ({ cardNum, playersInvolved }, { game }) => {
      handleCard(cardNum, playersInvolved, game);
    },
    resolveCard: (_, { game }) => {
      game.gamePhase = "Draw";
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

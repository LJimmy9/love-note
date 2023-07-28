import type { PlayerId, RuneClient } from "rune-games-sdk/multiplayer";
import {
  setupDeck,
  setupIdentityCards,
  updateCurrentTurn,
  getReshuffledDeck,
  createPlayer,
  handleRainyDay,
} from "./game-setup";
import {
  resolve,
  setReceiveFrom,
  resolveProcessing,
} from "./components/resolve-side-effects";

export interface Card {
  id: string;
  name: string;
  image: string;
  cardNum: number;
  description: string;
  restrictionToRole: string;
  count: number;
  canPlay: boolean;
  autoPlay: boolean;
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
  selectedCard: Card | null;
  receiveFrom: string;
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

export type Phase = "Draw" | "Play" | "Resolve" | "Default" | "Processing";

export interface CardSwapSetupProps {
  [key: string]: Card;
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
  gamePhase: Phase;
  direction: string;
  priority: string;
  cardSwapSetup: CardSwapSetupProps;
  animation: string;
  rainyDayIsPlay: boolean;
}

type GameActions = {
  // gets
  getLoveNotes: () => Array<Note>;
  // updates
  animationDone: () => void;
  animateLeft: () => void;
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
  selectCard: (params: { cardNumInPlay: number; selectedCard: Card }) => void;
  resolveProcessing: () => void;
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
      for (let i = 0; i < playersInvolved.length; i++) {
        const playerId = playersInvolved[i];
        game.players[playerId].sideEffect.active = true;
        game.players[playerId].sideEffect.cardNum = 2;
      }

      for (let i = 0; i < playersInvolved.length; i++) {
        setReceiveFrom(game, playersInvolved[i]);
      }

      break;
    case 3:
      for (let i = 0; i < playersInvolved.length; i++) {
        const playerId = playersInvolved[i];
        game.players[playerId].sideEffect.active = true;
        game.players[playerId].sideEffect.cardNum = 3;
      }
      // index 0 is the selected player, index 1 is the current player
      game.players[playersInvolved[0]].sideEffect.receiveFrom =
        playersInvolved[1];
      game.players[playersInvolved[1]].sideEffect.receiveFrom =
        playersInvolved[0];
      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      break;
    case 7:
      game.priority = game.priority === "highest" ? "lowest" : "highest";
      game.direction = game.direction === "right" ? "left" : "right";
      for (let i = 0; i < playersInvolved.length; i++) {
        const playerId = playersInvolved[i];
        game.players[playerId].sideEffect.active = true;
        game.players[playerId].sideEffect.cardNum = 7;
      }
      break;
    case 8:
      for (let i = 0; i < playersInvolved.length; i++) {
        const playerId = playersInvolved[i];
        game.players[playerId].sideEffect.active = true;
        game.players[playerId].sideEffect.cardNum = 8;
      }
      break;
  }
}

function initiateSideEffect(playCard: Card, game: GameState) {
  switch (playCard.cardNum) {
    case 2:
      handleCard(playCard.cardNum, Object.keys(game.players), game);
      break;
    case 7:
      handleCard(playCard.cardNum, Object.keys(game.players), game);
      break;
    case 8:
      handleCard(playCard.cardNum, Object.keys(game.players), game);
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
      // loveNotes: [],
      loveNotes: [
        { id: 0, text: "💕" },
        { id: 1, text: "💝" },
      ],
      turnNum: 0,
      gamePhase: "Draw",
      direction: "left",
      priority: "lowest",
      cardSwapSetup: {},
      animation: "",
      rainyDayIsPlay: false,
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
    resolveProcessing: (_, { game }) => {
      resolveProcessing(game);
    },
    // gets
    getLoveNotes: (_, { game }) => {
      return game.loveNotes;
    },

    // updates
    animationDone: (_, { game }) => {
      game.animation = "";
    },
    animateLeft: (_, { game }) => {
      game.animation = "allPassLeft";
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
    updateCurrentTurn: (_, { game }) => {
      updateCurrentTurn(game);
    },

    // actions
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

      handleRainyDay(game);

      // Reshuffle discard pile into the deck if deck has been exhausted
      if (game.deck.length <= 0) {
        game.deck = getReshuffledDeck(game);
        game.discardedCards = [];
      }

      if (playCard.name === "Rainy Day") {
        game.rainyDayIsPlay = true;
      }

      game.discardedCards.push(playCard);
      const newPlayerHand: Array<Card> = [];
      for (let i = 0; i < playerHand.length; i++) {
        if (playerHand[i].id !== playCard.id) {
          newPlayerHand.push(playerHand[i]);
        }
      }

      game.players[playerIdToUpdate].playerHand = newPlayerHand;

      game.animation = "playCenter";
      game.gamePhase = "Resolve";

      // only initiate side effect if the card triggers for everyone as soon as it's played
      initiateSideEffect(playCard, game);
    },
    handleCard: ({ cardNum, playersInvolved }, { game }) => {
      handleCard(cardNum, playersInvolved, game);
    },
    selectCard: ({ cardNumInPlay, selectedCard }, { game, playerId }) => {
      switch (cardNumInPlay) {
        case 2:
          game.cardSwapSetup[playerId] = selectedCard;
          resolve(game);
          break;
        case 3:
          game.cardSwapSetup[playerId] = selectedCard;
          // will resolve side effect and move onto next turn if possible
          resolve(game);
          break;
        default:
          break;
      }
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

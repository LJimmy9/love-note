import type { PlayerId, RuneClient } from "rune-games-sdk/multiplayer";
import {
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
import { createSetupDeck } from "./components/Configs/DeckFactory";

const env = import.meta.env.MODE;
// const env = "";
const setupConfig = createSetupDeck(env);
const setupDeckConfig = setupConfig("cardNum");
const setupDeck = setupDeckConfig(1, 0);

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
  hasLoveNoteAction: boolean;
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
  loveNoteHolder: PlayerId;
  meddleUsed: Array<PlayerId>;
  absentUsed: Array<PlayerId>;
  cardPlayed?: string;
  tattledOn: PlayerId;
}

type GameActions = {
  // gets
  getLoveNotes: () => Array<Note>;
  // updates
  animationDone: () => void;
  animateLeft: () => void;
  updateLoveNote: (params: {
    action: string;
    prompt: string;
    requestPlayerId: PlayerId;
    cardNum: number;
  }) => void;
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
  setLoveNoteHolder: (params: { loveNoteHolder: string }) => void;
  handleLastWords: (params: { lastWord: string }) => void;
  handleGameEnd: () => void;
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
      for (let i = 0; i < playersInvolved.length; i++) {
        const playerId = playersInvolved[i];
        game.players[playerId].sideEffect.active = true;
        game.players[playerId].sideEffect.cardNum = 1;

        // index 0 is the player who is being tattled on
        if (i == 0) {
          game.tattledOn = playerId;
          game.players[playerId].sideEffect.receiveFrom = game.currentTurn;
        }
      }
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
      for (let i = 0; i < playersInvolved.length; i++) {
        const playerId = playersInvolved[i];
        game.players[playerId].sideEffect.cardNum = 5;

        // index 0 is the player who played absent card
        if (i == 0) {
          game.absentUsed.push(playerId);
        }
      }
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
    case 4:
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
    // enter name of card and count to add to deck -- will not apply to prod
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
      direction: "left",
      priority: "lowest",
      cardSwapSetup: {},
      animation: "",
      rainyDayIsPlay: false,
      loveNoteHolder: "",
      meddleUsed: [], // every player can only use meddle once
      absentUsed: [], // every player can only use absent once
      tattledOn: "",
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
    updateLoveNote: (
      { action, prompt, requestPlayerId, cardNum },
      { game }
    ) => {
      if (cardNum === 6 && game.meddleUsed.includes(requestPlayerId)) return;
      switch (action) {
        case "add":
          if (game.players[requestPlayerId].hasLoveNoteAction) {
            game.loveNotes.push({
              id: game.loveNotes.length,
              text: prompt,
            });
            game.players[requestPlayerId].hasLoveNoteAction = false;
          }
          if (cardNum === 6) {
            game.meddleUsed.push(requestPlayerId);
          }
          // check for winning condition
          break;
        case "remove":
          if (game.players[requestPlayerId].hasLoveNoteAction) {
            for (let i = 0; i < game.loveNotes.length; i++) {
              if (game.loveNotes[i].text == prompt) {
                game.loveNotes.splice(i, 1);
                break;
              }
            }
            game.players[requestPlayerId].hasLoveNoteAction = false;
          }

          if (cardNum === 6) {
            game.meddleUsed.push(requestPlayerId);
          }
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

      // remove the draw'd card from the deck
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

      if (playCard.cardNum === 8) {
        game.rainyDayIsPlay = true;
      }

      handleRainyDay(game);

      // Reshuffle discard pile into the deck if deck has been exhausted
      if (game.deck.length <= 0) {
        game.deck = getReshuffledDeck(game);
        game.discardedCards = [];
      }

      game.discardedCards.push(playCard);
      // remove the played card from their hand
      const newPlayerHand: Array<Card> = [];
      for (let i = 0; i < playerHand.length; i++) {
        if (playerHand[i].id !== playCard.id) {
          newPlayerHand.push(playerHand[i]);
        }
      }
      game.players[playerIdToUpdate].playerHand = newPlayerHand;

      game.gamePhase = "Resolve";
      game.cardPlayed = playCard.name;

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
    setLoveNoteHolder: ({ loveNoteHolder }, { game }) => {
      // only reset hasLoveNoteAction if the previous holder of the love note was another player
      if (game.loveNoteHolder && loveNoteHolder) {
        const allPlayers = Object.keys(game.players);
        for (let i = 0; i < allPlayers.length; i++) {
          game.players[allPlayers[i]].hasLoveNoteAction = true;
        }
      }
      game.loveNoteHolder = loveNoteHolder;
    },
    handleLastWords: ({ lastWord }, { game }) => {
      for (let i = 0; i < Object.keys(game.players).length; i++) {
        const playerId = Object.keys(game.players)[i];
        game.players[playerId].sideEffect.active = true;
        game.players[playerId].sideEffect.cardNum = 10;
        game.players[playerId].sideEffect.receiveFrom = lastWord;
      }
    },
    handleGameEnd: (_, { game }) => {
      const otherPlayers = Object.keys(game.players).filter(
        (playerId) => ![game.currentTurn, game.tattledOn].includes(playerId)
      );

      const isTattledOnFriend =
        game.players[game.tattledOn].playerIdentity.role === "Friend";
      Rune.gameOver({
        players: {
          [game.currentTurn]: isTattledOnFriend ? "LOST" : "WON",
          [game.tattledOn]: isTattledOnFriend ? "WON" : "LOST",
          [otherPlayers[0]]: isTattledOnFriend ? "WON" : "LOST",
          [otherPlayers[1]]: isTattledOnFriend ? "WON" : "LOST",
        },
      });
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

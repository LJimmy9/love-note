import { AllPlayers, Card, GamePlayer, GameState, IdentityCard } from "./logic";
import cards from "./assets/cards.json";
import identityCards from "./assets/identity-cards.json";

export interface DistributedCardsProps {
  deck: Array<Card>;
  players: AllPlayers;
}

export function setupIdentityCards() {
  const idCards = [...identityCards];
  // Shuffle identity cards
  for (let i = idCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idCards[i], idCards[j]] = [idCards[j], idCards[i]];
  }
  return idCards as Array<IdentityCard>;
}

export function setupDeck() {
  let cardCounter = 0;
  const removeRainyDay = cards.filter((card) => card.name !== "Rainy Day");
  const staticDeck = [...removeRainyDay] as Array<Card>;
  // const staticDeck = [...cards] as Array<Card>;
  const startingDeck: Array<Card> = [];

  for (const card of staticDeck) {
    for (let j = 0; j < card.count; j++) {
      cardCounter++;
      const newCard = Object.assign({}, card);
      newCard.id = cardCounter.toString();
      startingDeck.push(newCard);
    }
  }

  shuffleDeck(startingDeck);

  return startingDeck;
}

function shuffleDeck(deck: Array<Card>) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export function handleRainyDay(game: GameState) {
  if (game.loveNotes.length > 0 && !game.rainyDayIsPlay) {
    const rainyDay = cards.filter((card) => card.name === "Rainy Day");
    const deckCopy = [...game.deck];
    deckCopy.push(...rainyDay);
    shuffleDeck(deckCopy);
    game.deck = deckCopy;
  }
}

export function updateCurrentTurn(game: GameState) {
  const allPlayers = Object.keys(game.players);
  const currTurnIdx = allPlayers.indexOf(game.currentTurn);
  let nextTurnIdx = currTurnIdx + 1;
  if (nextTurnIdx >= allPlayers.length) {
    nextTurnIdx = 0;
  }
  game.currentTurn = allPlayers[nextTurnIdx];
  game.turnNum += 1;
  game.gamePhase = "Draw";
  game.cardSwapSetup = {};

  for (let i = 0; i < allPlayers.length; i++) {
    game.players[allPlayers[i]].sideEffect = {
      active: false,
      cardNum: -1,
      receiveFrom: "",
      selectedCard: null,
    };
  }
}

export function getReshuffledDeck(game: GameState) {
  const shuffledDeck = game.discardedCards.filter(
    (card) => card.name !== "Rainy Day"
  );

  shuffleDeck(shuffledDeck);
  return shuffledDeck;
}

export function createPlayer(idCards: IdentityCard[], deck: Card[]) {
  const idCard = idCards.pop();
  const playerHand: Array<Card> = [];
  for (let i = 0; i < 2; i++) {
    const cardToAdd = deck.pop();
    if (cardToAdd) {
      playerHand.push(cardToAdd);
    }
  }
  const defaultPlayerHand: Array<Card> = [];
  const player: GamePlayer = {
    playerIdentity: idCard
      ? idCard
      : { name: "", image: "", description: "", role: "" },
    playerHand: playerHand.length ? playerHand : defaultPlayerHand,
    connected: true,
    sideEffect: {
      active: false,
      cardNum: -1,
      selectedCard: null,
      receiveFrom: "",
    },
    hasLoveNoteAction: true,
  };
  return player;
}

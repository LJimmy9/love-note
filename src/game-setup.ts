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
  const lnCard = cards.find((card) => card.cardNum === 0);
  const deckWithExclusions = cards.filter(
    (card) => card.name !== "Rainy Day" && card.name !== "Love Note"
  );
  const staticDeck = [...deckWithExclusions] as Array<Card>;
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

  // random idx between 11 - 17 to ensure Love Note is in starting hand
  const randomIdx = Math.round(Math.random() * (17 - 11) + 11);
  shuffleDeck(startingDeck);
  if (lnCard) {
    const loveNoteCard: Card = {
      id: "100",
      name: lnCard.name,
      image: lnCard.image,
      cardNum: lnCard.cardNum,
      description: lnCard.description,
      restrictionToRole: lnCard.restrictionToRole,
      canPlay: lnCard.canPlay,
      count: lnCard.count,
      autoPlay: lnCard.autoPlay,
    };
    loveNoteCard.id = "100";
    startingDeck.splice(randomIdx, 0, loveNoteCard);
  }

  return startingDeck;
}

export function shuffleDeck(deck: Array<Card>) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export function handleRainyDay(game: GameState) {
  const deckCopy = [...game.deck];
  if (game.loveNotes.length > 0 && !game.rainyDayIsPlay) {
    const rain = cards.filter((card) => card.name === "Rainy Day");
    const rainyDay: Card = {
      id: "200",
      name: rain[0].name,
      image: rain[0].image,
      cardNum: rain[0].cardNum,
      description: rain[0].description,
      restrictionToRole: rain[0].restrictionToRole,
      canPlay: rain[0].canPlay,
      count: rain[0].count,
      autoPlay: rain[0].autoPlay,
    };
    deckCopy.push(rainyDay);
    shuffleDeck(deckCopy);
    game.deck = deckCopy;
  } else if (game.loveNotes.length === 0 && !game.rainyDayIsPlay) {
    const filtered = deckCopy.filter((card) => card.name !== "Rainy Day");
    shuffleDeck(filtered);
    game.deck = filtered;
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

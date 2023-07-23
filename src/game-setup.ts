import { AllPlayers, Card, GameState, IdentityCard } from "./logic";
import cards from "./assets/cards.json";
import identityCards from "./assets/identity-cards.json";

export interface DistributedCardsProps {
  deck: Array<Card>;
  players: AllPlayers;
}

export function setupIdentityCards() {
  const idCards = [...identityCards];
  return idCards as Array<IdentityCard>;
}

export function setupDeck() {
  let cardCounter = 0;
  const staticDeck = [...cards] as Array<Card>;
  const startingDeck: Array<Card> = [];

  for (const card of staticDeck) {
    for (let j = 0; j < card.count; j++) {
      cardCounter++;
      const newCard = Object.assign({}, card);
      newCard.id = cardCounter.toString();
      startingDeck.push(newCard);
    }
  }

  return startingDeck;
}

function shuffleDeck(deck: Array<Card>) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export function getDistributedCards(game: GameState) {
  const playersCopy = { ...game.players };
  const deckCopy = [...game.deck];
  const identityCardsCopy = [...game.identityCards];

  shuffleDeck(deckCopy);

  // Shuffle identity cards
  // for (let i = identityCardsCopy.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [identityCardsCopy[i], identityCardsCopy[j]] = [
  //     identityCardsCopy[j],
  //     identityCardsCopy[i],
  //   ];
  // }

  // Distribute cards from the deck to each hand
  const cardCount = 2;
  const allPlayerIds = Object.keys(playersCopy);
  for (let i = 0; i < allPlayerIds.length; i++) {
    const playerId = allPlayerIds[i];
    // Assign identity card
    const idCard = identityCardsCopy.pop();
    if (idCard) {
      playersCopy[playerId].playerIdentity = identityCardsCopy[i];
    }

    // Assign cards from the deck to the hand
    const playerHand = playersCopy[playerId].playerHand;
    for (let j = 0; j < cardCount; j++) {
      const cardFromDeck = deckCopy.pop();
      if (!cardFromDeck) return;
      playerHand.push(cardFromDeck);
    }
  }

  const updatedState: DistributedCardsProps = {
    deck: deckCopy,
    players: playersCopy,
  };
  return updatedState;
}

export function setInitialTurn(game: GameState) {
  const allPlayers = Object.keys(game.players);
  const tempNum = Math.floor(Math.random() * allPlayers.length);
  const randidx = (tempNum + game.turnNum) % allPlayers.length;

  return allPlayers[randidx];
}

export function updateCurrentTurn(game: GameState) {
  // update curr turn
  game.turnNum += 1;
}

export function getReshuffledDeck(game: GameState) {
  const shuffledDeck = [...game.discardedCards];
  shuffleDeck(shuffledDeck);

  return shuffledDeck;
}

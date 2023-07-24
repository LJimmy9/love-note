import { AllPlayers, Card, GameState, IdentityCard } from "./logic";
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

  shuffleDeck(startingDeck);

  return startingDeck;
}

function shuffleDeck(deck: Array<Card>) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
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



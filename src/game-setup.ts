import { v4 as uuidv4 } from "uuid";
import { Card, GameState, IdentityCard } from "./logic";

import cards from "./assets/cards.json";
import identityCards from "./assets/identity-cards.json";

export function setupDeck() {
  const deckCards = cards as Array<Card>;
  const prepareDeck: Array<Card> = [];

  deckCards.forEach((card) => {
    for (let i = 0; i < card.count; i++) {
      const cardId = uuidv4();
      const newCard = Object.assign({}, card);
      newCard.id = cardId;
      prepareDeck.push(newCard);
    }
  });

  return prepareDeck;
}

export function setupIdentityCards() {
  return identityCards as Array<IdentityCard>;
}

export function distributeCards(game: GameState) {
  // distribute hands
  // distribute identities
}

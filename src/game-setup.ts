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

function shuffleCards(deck: Array<Card>, idCards: Array<IdentityCard>) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  for (let i = idCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idCards[i], idCards[j]] = [idCards[j], idCards[i]];
  }
}

export function distributeCards(game: GameState) {
  shuffleCards(game.deck, game.identityCards);

  // Distribute cards from the deck to each hand
  const cardCount = 2;
  Object.keys(game.players).forEach((key, idx) => {
    // Distribute an identity card to each player
    const idCard = game.identityCards.pop();
    if (idCard) {
      game.players[key].playerIdentity = game.identityCards[idx];
    }
    const playerHand = game.players[key].playerHand;
    for (let i = 0; i < cardCount; i++) {
      const card = game.deck.pop();
      if (!card) return;
      playerHand.push(card);
    }
  });
}

export function setCurrentTurn(game: GameState) {
  const allPlayers = Object.keys(game.players);
  const tempNum = Math.floor(Math.random() * allPlayers.length);
  const randidx = (tempNum + game.turnNum) % allPlayers.length;
  game.currentTurn = allPlayers[randidx];
  game.turnNum += 1;
}

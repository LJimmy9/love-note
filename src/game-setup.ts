import { Card, GameState, IdentityCard } from "./logic";
import cards from "./assets/cards.json";
import identityCards from "./assets/identity-cards.json";

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

export function distributeCards(game: GameState) {
  const playersCopy = { ...game.players };
  const deckCopy = [...game.deck];
  const identityCardsCopy = [...game.identityCards];

  for (let i = deckCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
  }

  for (let i = identityCardsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [identityCardsCopy[i], identityCardsCopy[j]] = [
      identityCardsCopy[j],
      identityCardsCopy[i],
    ];
  }

  // Distribute cards from the deck to each hand
  const cardCount = 2;

  const allPlayerIds = Object.keys(playersCopy);
  for (let i = 0; i < allPlayerIds.length; i++) {
    const playerId = allPlayerIds[i];
    // assign identity card
    const idCard = identityCardsCopy.pop();
    if (idCard) {
      playersCopy[playerId].playerIdentity = identityCardsCopy[i];
    }

    // assign cards from the deck to the hand
    const playerHand = playersCopy[playerId].playerHand;
    for (let j = 0; j < cardCount; j++) {
      const cardFromDeck = deckCopy.pop();
      if (!cardFromDeck) return;
      playerHand.push(cardFromDeck);
    }
  }

  game.deck = deckCopy;
  game.players = playersCopy;
}

export function setCurrentTurn(game: GameState) {
  const allPlayers = Object.keys(game.players);
  const tempNum = Math.floor(Math.random() * allPlayers.length);
  const randidx = (tempNum + game.turnNum) % allPlayers.length;
  game.currentTurn = allPlayers[randidx];
  game.turnNum += 1;
}

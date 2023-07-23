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
  const playersCopy = Object.assign({}, game.players);
  const deckCopy: Array<Card> = [...game.deck];
  const idCards: Array<IdentityCard> = [...game.identityCards];
  shuffleCards(deckCopy, idCards);

  // Distribute cards from the deck to each hand
  const cardCount = 2;
  Object.keys(playersCopy).forEach((key) => {
    // Distribute an identity card to each player
    const idCard = idCards.pop();
    if (idCard) {
      playersCopy[key].playerIdentity = idCard;
    }
    const playerHand = playersCopy[key].playerHand;
    for (let i = 0; i < cardCount; i++) {
      const card = deckCopy.pop();
      if (!card) return;
      playerHand.push(card);
    }
  });

  game.deck = deckCopy;
  game.players = playersCopy;
}

export function setCurrentTurn(game: GameState) {
  // game.players = {'player1': {playerHand: [], ...}}
  // const;
  // ['player1', 'player2', 'player3']
  const allPlayers = Object.keys(game.players);

  /*const TempArr=[];
    for(let i = allPlayers.length; i<0; i--){
    const randidx = Math.floor(Math.random()*i)
    const tempholder= allPlayers[i]
    TempArr.push(allPlayers[randidx])
    
  }*/
}

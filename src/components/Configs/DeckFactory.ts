import { setupDeck, shuffleDeck } from "../../game-setup";
import cards from "../../../src/assets/cards.json";

export function configCards() {
  return (cardName: string, countConfig: number) => {
    const deck = setupDeck();

    const card = cards.filter((card) => card.name == cardName);

    for (let i = 0; i < countConfig; i++) {
      deck.push(...card);
    }

    shuffleDeck(deck);

    return deck;
  };
}

export function defaultSetup() {
  return (cardName: string, countConfig: number) => setupDeck();
}

export function createSetupDeck(env?: string) {
  if (env === "development") {
    return configCards;
  } else {
    return defaultSetup;
  }
}

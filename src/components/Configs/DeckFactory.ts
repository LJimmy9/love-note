import { setupDeck, shuffleDeck } from "../../game-setup";
import cards from "../../../src/assets/cards.json";

export function configCards(choice: string) {
  if (choice == "cardNum") {
    return (cardNum: any, countConfig: number) => {
      return () => {
        let counter = 999;
        const deck = setupDeck();

        const card = cards.filter((card) => card.cardNum == cardNum);

        for (let i = 0; i < countConfig; i++) {
          card[0].id = counter.toString();
          deck.push({ ...card[0] });
          counter++;
        }
        shuffleDeck(deck);

        return deck;
      };
    };
  } else {
    return (cardName: any, countConfig: number) => {
      return () => {
        const deck = setupDeck();

        const card = cards.filter((card) => card.name == cardName);

        for (let i = 0; i < countConfig; i++) {
          deck.push(...card);
        }

        shuffleDeck(deck);

        return deck;
      };
    };
  }
}

export function defaultSetup() {
  return (_cardNum: any, _countConfig: number) => () => setupDeck();
}

export function createSetupDeck(env?: string) {
  if (env === "development") {
    return configCards;
  } else {
    return defaultSetup;
  }
}

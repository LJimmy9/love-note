import { atom } from "jotai";

export const $currAnimation = atom<string>("");

export const $playAnimation = atom(null, (_get, set, value: string) => {
  set($isAnimating, true);
  set($currAnimation, value);
});

export const $isAnimating = atom<boolean>(false);

export const $doneAnimating = atom(null, (_, set) => {
  set($isAnimating, false);
  Rune.actions.animationDone();
});
